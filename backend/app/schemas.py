from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Vendor Schemas ---
class VendorBase(BaseModel):
    name: str
    code: str
    domain: Optional[str] = None
    tax_id: Optional[str] = None
    country: str = "IN"
    established_year: int = 2020
    verified_bank_account: str
    verified_routing_number: str
    verified_bank_name: str
    avg_invoice_amount: float = 1000000.0
    max_historical_amount: float = 2500000.0
    risk_profile: str = "LOW"
    is_verified: bool = True
    notes: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class VendorResponse(VendorBase):
    id: int
    total_invoices_paid: int
    total_spend_ytd: float
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Invoice Schemas ---
class LineItem(BaseModel):
    description: str
    quantity: float = 1.0
    unit_price: float
    total: float

class InvoiceIngestRequest(BaseModel):
    raw_content: Optional[str] = None
    file_name: Optional[str] = "manual_invoice.txt"
    file_type: str = "text"
    email_thread_context: Optional[str] = None
    
    invoice_number: Optional[str] = None
    vendor_name: Optional[str] = None
    amount: Optional[float] = None
    currency: str = "INR"
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    bank_account: Optional[str] = None
    routing_number: Optional[str] = None
    bank_name: Optional[str] = None
    line_items: List[LineItem] = []

class RiskFactor(BaseModel):
    category: str
    severity: str
    title: str
    description: str
    score_impact: int
    evidence: Optional[str] = None

class AgentLogResponse(BaseModel):
    id: int
    agent_name: str
    agent_type: str
    step_number: int
    status: str
    verdict: str
    reasoning: str
    confidence: float
    extracted_data: Dict[str, Any]
    signals_detected: List[Any]
    execution_time_ms: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

class AuditTrailResponse(BaseModel):
    id: int
    action: str
    actor: str
    details: str
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

class InvoiceDetailResponse(BaseModel):
    id: int
    invoice_number: str
    vendor_id: Optional[int] = None
    vendor_name_extracted: str
    amount: float
    currency: str
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    bank_account: str
    routing_number: Optional[str] = None
    bank_name: Optional[str] = None
    file_name: Optional[str] = None
    file_type: str
    raw_content: Optional[str] = None
    email_thread_context: Optional[str] = None
    line_items: List[Any] = []
    
    status: str
    risk_score: int
    risk_level: str
    confidence_score: float
    risk_factors: List[RiskFactor] = []
    evidence_summary: Optional[str] = None
    recommended_action: str
    
    reviewer_decision: Optional[str] = None
    reviewer_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    
    vendor: Optional[VendorResponse] = None
    agent_logs: List[AgentLogResponse] = []
    audit_trails: List[AuditTrailResponse] = []
    model_config = ConfigDict(from_attributes=True)

class InvoiceListItem(BaseModel):
    id: int
    invoice_number: str
    vendor_name_extracted: str
    amount: float
    currency: str
    status: str
    risk_score: int
    risk_level: str
    confidence_score: float
    recommended_action: str
    created_at: datetime
    reviewer_decision: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# --- Human Review Request ---
class ReviewActionRequest(BaseModel):
    decision: str  # VERIFIED_AND_RELEASED, REJECTED_FRAUD, REQUESTED_INFO
    reviewer_name: str = "Chief Compliance Officer"
    notes: Optional[str] = None
    adjusted_risk_score: Optional[int] = None
    update_vendor_baseline: bool = True

# --- Batch Processing Schemas ---
class BatchIngestRequest(BaseModel):
    invoices: List[InvoiceIngestRequest]
    batch_name: Optional[str] = "Batch Upload"

class BatchSummaryResponse(BaseModel):
    batch_id: str
    total_processed: int
    safe_count: int
    review_count: int
    fraud_hold_count: int
    total_amount_processed: float
    total_money_protected: float
    invoices: List[InvoiceListItem]

# --- Dashboard KPIs ---
class DashboardStatsResponse(BaseModel):
    total_invoices: int
    processed_invoices: int
    flagged_invoices: int
    auto_cleared_invoices: int
    money_protected: float
    total_disbursed: float
    average_risk_score: float
    risk_distribution: Dict[str, int]
    fraud_categories_breakdown: Dict[str, int]
    recent_alerts: List[InvoiceListItem]
