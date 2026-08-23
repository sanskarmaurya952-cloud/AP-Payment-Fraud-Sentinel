from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Vendor, Invoice, BankChangeHistory, VendorFeedbackMemory
from app.schemas import VendorResponse, VendorCreate

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.get("", response_model=List[VendorResponse])
def list_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).order_by(Vendor.name).all()

@router.get("/{vendor_id}")
def get_vendor_profile(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    invoices = db.query(Invoice).filter(Invoice.vendor_id == vendor_id).order_by(Invoice.created_at.desc()).all()
    bank_changes = db.query(BankChangeHistory).filter(BankChangeHistory.vendor_id == vendor_id).all()
    feedback = db.query(VendorFeedbackMemory).filter(VendorFeedbackMemory.vendor_id == vendor_id).all()

    return {
        "vendor": vendor,
        "invoices": invoices,
        "bank_changes": bank_changes,
        "feedback_memory": feedback
    }

@router.post("", response_model=VendorResponse)
def create_vendor(vendor_in: VendorCreate, db: Session = Depends(get_db)):
    vendor = Vendor(**vendor_in.dict())
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor
