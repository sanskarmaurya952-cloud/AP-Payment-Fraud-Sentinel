import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models import Vendor, Invoice, AgentExecutionLog, PaymentAuditTrail
from app.schemas import InvoiceIngestRequest
from app.pipeline.sentinel_pipeline import pipeline
from app.pipeline.memory import VendorMemoryStore

TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Seed test Indian vendor
    v = Vendor(
        name="Tata Tech Solutions Pvt Ltd",
        code="VEND-TATA-01",
        country="IN",
        verified_bank_name="HDFC Bank",
        verified_bank_account="50100239481928",
        verified_routing_number="HDFC0000060",
        avg_invoice_amount=1000000.0,
        max_historical_amount=2500000.0,
        total_invoices_paid=24,
        total_spend_ytd=24000000.0,
        is_verified=True
    )
    db.add(v)
    db.commit()
    
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.mark.asyncio
async def test_bec_fraud_detection(db_session):
    """Test BEC attack with bank account delta + 4.82x amount spike in INR."""
    req = InvoiceIngestRequest(
        invoice_number="INV-TATA-10291",
        vendor_name="Tata Tech Solutions Pvt Ltd",
        amount=4820000.0,
        currency="INR",
        bank_account="98765432109822",
        routing_number="MAHB0001928",
        bank_name="Unverified Cooperative Bank",
        raw_content="Invoice INV-TATA-10291 from Tata Tech Solutions Pvt Ltd for ₹48,20,000",
        email_thread_context="URGENT: Please wire immediately to new cooperative bank account 98765432109822."
    )
    
    invoice = await pipeline.run_pipeline(db_session, req)
    
    assert invoice.risk_score >= 70
    assert invoice.risk_level == "HIGH"
    assert invoice.recommended_action == "HOLD_PAYMENT"
    assert invoice.status == "PAYMENT_HOLD"
    
    logs = db_session.query(AgentExecutionLog).filter(AgentExecutionLog.invoice_id == invoice.id).all()
    assert len(logs) == 4

@pytest.mark.asyncio
async def test_safe_invoice_autoclear(db_session):
    """Test legitimate routine invoice matching registered HDFC bank and baseline amount."""
    req = InvoiceIngestRequest(
        invoice_number="INV-TATA-9981",
        vendor_name="Tata Tech Solutions Pvt Ltd",
        amount=950000.0,
        currency="INR",
        bank_account="50100239481928",
        routing_number="HDFC0000060",
        bank_name="HDFC Bank",
        raw_content="Routine monthly invoice INV-TATA-9981 for ₹9,50,000"
    )
    
    invoice = await pipeline.run_pipeline(db_session, req)
    
    assert invoice.risk_score < 30
    assert invoice.risk_level == "LOW"
    assert invoice.recommended_action == "AUTO_CLEAR"
    assert invoice.status == "AUTO_CLEARED"

@pytest.mark.asyncio
async def test_human_in_the_loop_approval_and_memory(db_session):
    """Test human reviewer approving an invoice and updating adaptive vendor memory."""
    req = InvoiceIngestRequest(
        invoice_number="INV-TATA-7711",
        vendor_name="Tata Tech Solutions Pvt Ltd",
        amount=2800000.0,
        currency="INR",
        bank_account="50100239481928",
        routing_number="HDFC0000060"
    )
    invoice = await pipeline.run_pipeline(db_session, req)
    
    updated_inv = VendorMemoryStore.record_human_decision(
        db=db_session,
        invoice=invoice,
        decision="VERIFIED_AND_RELEASED",
        reviewer_name="VP of Finance India",
        notes="Verified expanded project scope directly with Tata Tech account director.",
        update_baseline=True
    )
    
    assert updated_inv.status == "APPROVED"
    assert updated_inv.reviewer_decision == "VERIFIED_AND_RELEASED"
