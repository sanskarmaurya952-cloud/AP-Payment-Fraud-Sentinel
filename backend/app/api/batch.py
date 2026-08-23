import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Invoice
from app.schemas import BatchIngestRequest, BatchSummaryResponse, InvoiceListItem
from app.pipeline.sentinel_pipeline import pipeline

router = APIRouter(prefix="/batch", tags=["Batch Processing"])

@router.post("/process", response_model=BatchSummaryResponse)
async def process_batch_invoices(
    request: BatchIngestRequest,
    db: Session = Depends(get_db)
):
    """
    Parallel Batch Ingestion & Analysis:
    Simulates high-throughput accounts payable processing (e.g. 50-100 invoices concurrently).
    """
    batch_id = f"BATCH-{uuid.uuid4().hex[:8].upper()}"
    invoices = await pipeline.run_batch(db, request.invoices, batch_id=batch_id)

    safe_count = sum(1 for inv in invoices if inv.status == "AUTO_CLEARED" or inv.risk_level == "LOW")
    review_count = sum(1 for inv in invoices if inv.status == "REVIEW_QUEUE" or inv.risk_level == "MEDIUM")
    fraud_hold_count = sum(1 for inv in invoices if inv.status == "PAYMENT_HOLD" or inv.risk_level == "HIGH")

    total_amount = sum(inv.amount for inv in invoices)
    money_protected = sum(inv.amount for inv in invoices if inv.risk_level == "HIGH")

    return {
        "batch_id": batch_id,
        "total_processed": len(invoices),
        "safe_count": safe_count,
        "review_count": review_count,
        "fraud_hold_count": fraud_hold_count,
        "total_amount_processed": total_amount,
        "total_money_protected": money_protected,
        "invoices": invoices
    }

@router.get("/{batch_id}", response_model=BatchSummaryResponse)
def get_batch_summary(
    batch_id: str,
    db: Session = Depends(get_db)
):
    invoices = db.query(Invoice).filter(Invoice.batch_id == batch_id).all()
    if not invoices:
        raise HTTPException(status_code=404, detail="Batch not found")

    safe_count = sum(1 for inv in invoices if inv.risk_level == "LOW")
    review_count = sum(1 for inv in invoices if inv.risk_level == "MEDIUM")
    fraud_hold_count = sum(1 for inv in invoices if inv.risk_level == "HIGH")

    total_amount = sum(inv.amount for inv in invoices)
    money_protected = sum(inv.amount for inv in invoices if inv.risk_level == "HIGH")

    return {
        "batch_id": batch_id,
        "total_processed": len(invoices),
        "safe_count": safe_count,
        "review_count": review_count,
        "fraud_hold_count": fraud_hold_count,
        "total_amount_processed": total_amount,
        "total_money_protected": money_protected,
        "invoices": invoices
    }
