from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    code = Column(String(64), unique=True, index=True)
    domain = Column(String(255), nullable=True)
    tax_id = Column(String(64), nullable=True)
    country = Column(String(64), default="US")
    established_year = Column(Integer, default=2020)
    
    # Official registered bank credentials
    verified_bank_account = Column(String(64), nullable=False)
    verified_routing_number = Column(String(64), nullable=False)
    verified_bank_name = Column(String(255), nullable=False)
    
    # Historical Payment Baselines
    avg_invoice_amount = Column(Float, default=10000.0)
    std_invoice_amount = Column(Float, default=2500.0)
    max_historical_amount = Column(Float, default=25000.0)
    total_invoices_paid = Column(Integer, default=12)
    total_spend_ytd = Column(Float, default=120000.0)
    
    # Risk Profile
    risk_profile = Column(String(32), default="LOW")  # LOW, MEDIUM, HIGH, BLOCKED
    is_verified = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    invoices = relationship("Invoice", back_populates="vendor")
    bank_changes = relationship("BankChangeHistory", back_populates="vendor")
    feedback_memories = relationship("VendorFeedbackMemory", back_populates="vendor")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(128), nullable=False, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)
    vendor_name_extracted = Column(String(255), nullable=False)
    
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    invoice_date = Column(String(32), nullable=True)
    due_date = Column(String(32), nullable=True)
    
    # Bank details on this specific invoice
    bank_account = Column(String(64), nullable=False)
    routing_number = Column(String(64), nullable=True)
    bank_name = Column(String(255), nullable=True)
    swift_bic = Column(String(64), nullable=True)
    
    # Mixed media & raw inputs
    file_name = Column(String(255), nullable=True)
    file_type = Column(String(32), default="json") # pdf, image, email, json, text
    raw_content = Column(Text, nullable=True)
    email_thread_context = Column(Text, nullable=True)
    line_items = Column(JSON, default=list)
    
    # Sentinel Risk Engine Results
    status = Column(String(32), default="REVIEW_QUEUE") # AUTO_CLEARED, REVIEW_QUEUE, PAYMENT_HOLD, APPROVED, REJECTED
    risk_score = Column(Integer, default=0) # 0 to 100
    risk_level = Column(String(32), default="LOW") # LOW, MEDIUM, HIGH
    confidence_score = Column(Float, default=0.95) # 0.0 to 1.0
    
    # Detailed Risk Flags & Analysis
    risk_factors = Column(JSON, default=list) # List of dicts: { category, severity, message, score_impact }
    evidence_summary = Column(Text, nullable=True)
    recommended_action = Column(String(64), default="REVIEW") # AUTO_CLEAR, HUMAN_REVIEW, HOLD_PAYMENT
    
    # Batch processing metadata
    is_batch = Column(Boolean, default=False)
    batch_id = Column(String(64), nullable=True, index=True)
    
    # Human-In-The-Loop Decision
    reviewer_decision = Column(String(32), nullable=True) # VERIFIED_AND_RELEASED, REJECTED_FRAUD, REQUESTED_INFO
    reviewer_notes = Column(Text, nullable=True)
    reviewed_by = Column(String(128), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    vendor = relationship("Vendor", back_populates="invoices")
    agent_logs = relationship("AgentExecutionLog", back_populates="invoice", cascade="all, delete-orphan")
    audit_trails = relationship("PaymentAuditTrail", back_populates="invoice", cascade="all, delete-orphan")


class AgentExecutionLog(Base):
    __tablename__ = "agent_execution_logs"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    agent_name = Column(String(128), nullable=False)
    agent_type = Column(String(64), nullable=False) # invoice_intelligence, vendor_verification, fraud_risk, evidence_validator
    step_number = Column(Integer, default=1)
    
    status = Column(String(32), default="SUCCESS") # SUCCESS, WARNING, CRITICAL
    verdict = Column(String(255), nullable=False)
    reasoning = Column(Text, nullable=False)
    confidence = Column(Float, default=0.95)
    
    extracted_data = Column(JSON, default=dict)
    signals_detected = Column(JSON, default=list)
    execution_time_ms = Column(Integer, default=120)
    
    timestamp = Column(DateTime, default=datetime.utcnow)

    invoice = relationship("Invoice", back_populates="agent_logs")


class BankChangeHistory(Base):
    __tablename__ = "bank_change_history"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    old_bank_account = Column(String(64), nullable=False)
    new_bank_account = Column(String(64), nullable=False)
    old_routing = Column(String(64), nullable=True)
    new_routing = Column(String(64), nullable=True)
    change_date = Column(DateTime, default=datetime.utcnow)
    authorization_source = Column(String(128), default="unverified_invoice") # email_request, vendor_portal, unverified_invoice
    is_verified = Column(Boolean, default=False)
    risk_level = Column(String(32), default="HIGH")

    vendor = relationship("Vendor", back_populates="bank_changes")


class PaymentAuditTrail(Base):
    __tablename__ = "payment_audit_trails"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    action = Column(String(64), nullable=False) # INVOICE_INGESTED, RISK_CALCULATED, PAYMENT_HOLD_APPLIED, VERIFIED_AND_RELEASED, REJECTED
    actor = Column(String(128), default="SYSTEM_AGENT") # SYSTEM_AGENT, FINANCE_MANAGER, AI_VALIDATOR
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    invoice = relationship("Invoice", back_populates="audit_trails")


class VendorFeedbackMemory(Base):
    __tablename__ = "vendor_feedback_memory"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=True)
    original_risk_score = Column(Integer, nullable=False)
    human_action = Column(String(32), nullable=False) # APPROVED, REJECTED
    feedback_reason = Column(Text, nullable=True)
    learned_context = Column(Text, nullable=True) # e.g. "Vendor legitimate annual hardware refresh approved by CFO"
    timestamp = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor", back_populates="feedback_memories")
