from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import Invoice, Vendor
from app.schemas import (
    InvoiceIngestRequest,
    InvoiceDetailResponse,
    InvoiceListItem,
    ReviewActionRequest
)
from app.pipeline.sentinel_pipeline import pipeline
from app.pipeline.memory import VendorMemoryStore

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.post("/analyze", response_model=InvoiceDetailResponse)
async def analyze_invoice(
    request: InvoiceIngestRequest,
    db: Session = Depends(get_db)
):
    """
    Ingest an invoice (structured, raw text, or mixed-media email thread) and execute
    the 4-agent Sentinel security pipeline.
    """
    invoice = await pipeline.run_pipeline(db, request)
    return invoice

@router.get("", response_model=List[InvoiceListItem])
def list_invoices(
    status: Optional[str] = Query(None, description="Filter by status (AUTO_CLEARED, REVIEW_QUEUE, PAYMENT_HOLD, APPROVED, REJECTED)"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (LOW, MEDIUM, HIGH)"),
    search: Optional[str] = Query(None, description="Search by vendor name or invoice number"),
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(Invoice)
    if status:
        query = query.filter(Invoice.status == status)
    if risk_level:
        query = query.filter(Invoice.risk_level == risk_level)
    if search:
        query = query.filter(
            (Invoice.vendor_name_extracted.ilike(f"%{search}%")) |
            (Invoice.invoice_number.ilike(f"%{search}%"))
        )
    return query.order_by(Invoice.created_at.desc()).limit(limit).all()

@router.get("/{invoice_id}", response_model=InvoiceDetailResponse)
def get_invoice_detail(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/{invoice_id}/review", response_model=InvoiceDetailResponse)
def review_invoice(
    invoice_id: int,
    review_req: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    """
    Human-In-The-Loop action: Chief Compliance/Finance Officer confirms, releases, or rejects payment.
    Updates the vendor's dynamic adaptive memory.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    updated_invoice = VendorMemoryStore.record_human_decision(
        db=db,
        invoice=invoice,
        decision=review_req.decision,
        reviewer_name=review_req.reviewer_name,
        notes=review_req.notes or "",
        update_baseline=review_req.update_vendor_baseline
    )
    return updated_invoice

@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    db.delete(invoice)
    db.commit()
    return {"message": f"Invoice {invoice_id} deleted"}
