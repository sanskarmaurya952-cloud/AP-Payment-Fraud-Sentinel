import os
import asyncio
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import Vendor, Invoice, BankChangeHistory, AgentExecutionLog, PaymentAuditTrail
from app.schemas import InvoiceIngestRequest
from app.pipeline.sentinel_pipeline import pipeline

from app.api.invoices import router as invoices_router
from app.api.batch import router as batch_router
from app.api.dashboard import router as dashboard_router
from app.api.vendors import router as vendors_router
from app.api.demo import router as demo_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial enterprise vendors and high-profile benchmark invoices
    db: Session = SessionLocal()
    try:
        vendor_count = db.query(Vendor).count()
        if vendor_count == 0:
            v1 = Vendor(
                name="Tata Tech Solutions Pvt Ltd",
                code="VEND-TATA-01",
                domain="tatatech-solutions.com",
                tax_id="27AAACT2727Q1ZW",
                country="IN",
                verified_bank_name="HDFC Bank",
                verified_bank_account="50100239481928",
                verified_routing_number="HDFC0000060",
                established_year=2014,
                avg_invoice_amount=1000000.0,
                max_historical_amount=2500000.0,
                total_invoices_paid=24,
                total_spend_ytd=24000000.0,
                is_verified=True,
                notes="Primary IT & Hardware infrastructure supplier"
            )
            v2 = Vendor(
                name="Mahindra Logistics Ltd",
                code="VEND-MAH-02",
                domain="mahindralogistics.com",
                tax_id="27AABCM8291M1Z5",
                country="IN",
                verified_bank_name="State Bank of India",
                verified_bank_account="389201928301",
                verified_routing_number="SBIN0001177",
                established_year=2016,
                avg_invoice_amount=850000.0,
                max_historical_amount=1800000.0,
                total_invoices_paid=18,
                total_spend_ytd=15300000.0,
                is_verified=True,
                notes="Pan-India multimodal freight and supply chain logistics"
            )
            v3 = Vendor(
                name="Infosys BPM Services",
                code="VEND-INFY-03",
                domain="infosys.com",
                tax_id="29AAACI1332L1ZV",
                country="IN",
                verified_bank_name="ICICI Bank",
                verified_bank_account="000405012398",
                verified_routing_number="ICIC0000004",
                established_year=2012,
                avg_invoice_amount=320000.0,
                max_historical_amount=650000.0,
                total_invoices_paid=36,
                total_spend_ytd=11520000.0,
                is_verified=True,
                notes="Managed enterprise business process services"
            )
            v4 = Vendor(
                name="Reliance Cloud Infrastructure",
                code="VEND-RIL-04",
                domain="ril.com",
                tax_id="27AAACR1290K1ZY",
                country="IN",
                verified_bank_name="Axis Bank",
                verified_bank_account="918020038910291",
                verified_routing_number="UTIB0000008",
                established_year=2019,
                avg_invoice_amount=1500000.0,
                max_historical_amount=3500000.0,
                total_invoices_paid=12,
                total_spend_ytd=18000000.0,
                is_verified=True,
                notes="Tier-4 Cloud Data Center & Connectivity"
            )
            db.add_all([v1, v2, v3, v4])
            db.commit()

            # Seed High-Profile Benchmark Invoices
            # Benchmark 1: BEC Fraudulent Bank Switch (Tata Tech - ₹48,20,000)
            inv1_req = InvoiceIngestRequest(
                file_name="INV-TATA-10291_EdgeHardware.pdf",
                file_type="pdf",
                invoice_number="INV-TATA-10291",
                vendor_name="Tata Tech Solutions Pvt Ltd",
                amount=4820000.0,
                currency="INR",
                bank_account="98765432109822",
                routing_number="MAHB0001928",
                bank_name="Unverified Cooperative Bank",
                raw_content="""GST TAX INVOICE #INV-TATA-10291
Vendor: Tata Tech Solutions Pvt Ltd
GSTIN: 27AAACT2727Q1ZW
Bill To: Enterprise India Corp Accounts Payable
Date: 2026-08-20
Amount Due: ₹48,20,000.00 INR

Line Items:
- High-Performance Edge Computing Nodes (10 units @ ₹4,82,000.00): ₹48,20,000.00

Payment Remittance Details:
Bank: Unverified Cooperative Bank (Mule Account)
Account Number: 98765432109822
IFSC Code: MAHB0001928""",
                email_thread_context="""From: accounts@tatatech-urgent-invoices.com <spoofed-domain>
To: finance@enterprisecorp.in
Subject: URGENT: Updated Banking Coordinates for Invoice #INV-TATA-10291

Hi Finance Team,
Please note we have recently migrated our treasury operations to a new bank account due to an internal corporate audit. Please immediately wire the ₹48,20,000 funds for Invoice INV-TATA-10291 to our new account 98765432109822 (IFSC: MAHB0001928) today to avoid cloud server hardware dispatch cancellation.
Regards, Chief Financial Officer"""
            )
            await pipeline.run_pipeline(db, inv1_req)

            # Benchmark 2: Amount Spike Anomaly (Mahindra Logistics - ₹28,40,000)
            inv2_req = InvoiceIngestRequest(
                file_name="INV-MAH-10284_Freight.pdf",
                file_type="pdf",
                invoice_number="INV-MAH-10284",
                vendor_name="Mahindra Logistics Ltd",
                amount=2840000.0,
                currency="INR",
                bank_account="389201928301",
                routing_number="SBIN0001177",
                bank_name="State Bank of India",
                raw_content="""GST INVOICE #INV-MAH-10284
Vendor: Mahindra Logistics Ltd
GSTIN: 27AABCM8291M1Z5
Amount: ₹28,40,000.00 INR
Date: 2026-08-19
Line Items:
- Multi-Hub Expedited Pan-India Freight (3.34x standard allocation): ₹28,40,000.00
Payment Info:
Bank: State Bank of India
Account: 389201928301
IFSC: SBIN0001177""",
                email_thread_context="Standard monthly logistics billing with nationwide surge charges."
            )
            await pipeline.run_pipeline(db, inv2_req)

            # Benchmark 3: Safe Routine Invoice (Infosys BPM - ₹3,20,000)
            inv3_req = InvoiceIngestRequest(
                file_name="INV-INFY-10280_Maintenance.pdf",
                file_type="pdf",
                invoice_number="INV-INFY-10280",
                vendor_name="Infosys BPM Services",
                amount=320000.0,
                currency="INR",
                bank_account="000405012398",
                routing_number="ICIC0000004",
                bank_name="ICICI Bank",
                raw_content="""TAX INVOICE #INV-INFY-10280
Vendor: Infosys BPM Services
GSTIN: 29AAACI1332L1ZV
Amount: ₹3,20,000.00 INR
Date: 2026-08-18
Line Items:
- Monthly Managed IT & BPM Infrastructure Maintenance: ₹3,20,000.00
Remit to:
ICICI Bank
Account: 000405012398
IFSC: ICIC0000004""",
                email_thread_context="Standard recurring monthly PO #88921"
            )
            await pipeline.run_pipeline(db, inv3_req)

    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Multi-Agent AI Accounts Payable Security & Payment Fraud Prevention Engine",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(invoices_router, prefix="/api/v1")
app.include_router(batch_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(vendors_router, prefix="/api/v1")
app.include_router(demo_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "service": "AP Payment Fraud Sentinel",
        "version": settings.VERSION,
        "status": "HEALTHY",
        "mode": "ACTIVE_DEFENSE_MODE",
        "currency": "INR (₹)"
    }
