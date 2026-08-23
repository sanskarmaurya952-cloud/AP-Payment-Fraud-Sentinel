from sqlalchemy.orm import Session
from datetime import datetime
from app.models import Vendor, Invoice, VendorFeedbackMemory, PaymentAuditTrail

class VendorMemoryStore:
    """
    Manages long-term adaptive memory and learning feedback loops for vendors.
    Updates historical payment profiles when human reviewers make approval or rejection decisions.
    """

    @staticmethod
    def record_human_decision(
        db: Session,
        invoice: Invoice,
        decision: str,
        reviewer_name: str,
        notes: str,
        update_baseline: bool = True
    ):
        invoice.reviewer_decision = decision
        invoice.reviewed_by = reviewer_name
        invoice.reviewer_notes = notes
        invoice.reviewed_at = datetime.utcnow()
        
        if decision == "VERIFIED_AND_RELEASED":
            invoice.status = "APPROVED"
            audit_action = "PAYMENT_RELEASED_BY_HUMAN"
            details = f"Approved and released by {reviewer_name}. Notes: {notes}"
        elif decision == "REJECTED_FRAUD":
            invoice.status = "REJECTED"
            audit_action = "PAYMENT_REJECTED_AS_FRAUD"
            details = f"Payment blocked and flagged as fraud by {reviewer_name}. Notes: {notes}"
        else:
            invoice.status = "REVIEW_QUEUE"
            audit_action = "ADDITIONAL_INFO_REQUESTED"
            details = f"Clarification requested by {reviewer_name}. Notes: {notes}"

        # 1. Audit Trail Record
        audit_trail = PaymentAuditTrail(
            invoice_id=invoice.id,
            action=audit_action,
            actor=reviewer_name,
            details=details
        )
        db.add(audit_trail)

        # 2. Update Vendor Feedback Memory
        if invoice.vendor_id:
            vendor = db.query(Vendor).filter(Vendor.id == invoice.vendor_id).first()
            if vendor:
                memory = VendorFeedbackMemory(
                    vendor_id=vendor.id,
                    invoice_id=invoice.id,
                    original_risk_score=invoice.risk_score,
                    human_action=decision,
                    feedback_reason=notes,
                    learned_context=f"Reviewer {reviewer_name} verdict: {decision}. Notes: {notes}"
                )
                db.add(memory)

                # 3. Dynamic Baseline Recalibration if Approved
                if decision == "VERIFIED_AND_RELEASED" and update_baseline:
                    vendor.total_invoices_paid += 1
                    vendor.total_spend_ytd += invoice.amount
                    # Weighted average recalculation
                    old_avg = vendor.avg_invoice_amount
                    n = vendor.total_invoices_paid
                    vendor.avg_invoice_amount = round(((old_avg * (n - 1)) + invoice.amount) / n, 2)
                    if invoice.amount > vendor.max_historical_amount:
                        vendor.max_historical_amount = invoice.amount
                elif decision == "REJECTED_FRAUD":
                    vendor.risk_profile = "HIGH"

        db.commit()
        db.refresh(invoice)
        return invoice
