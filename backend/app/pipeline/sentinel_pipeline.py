import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.models import Invoice, Vendor, AgentExecutionLog, PaymentAuditTrail
from app.agents.invoice_intelligence import InvoiceIntelligenceAgent
from app.agents.vendor_verification import VendorVerificationAgent
from app.agents.fraud_risk_agent import FraudRiskAgent
from app.agents.evidence_validator import EvidenceValidatorAgent
from app.schemas import InvoiceIngestRequest

class SentinelPipeline:
    def __init__(self):
        self.invoice_agent = InvoiceIntelligenceAgent()
        self.vendor_agent = VendorVerificationAgent()
        self.fraud_agent = FraudRiskAgent()
        self.validator_agent = EvidenceValidatorAgent()

    async def run_pipeline(
        self,
        db: Session,
        request: InvoiceIngestRequest,
        batch_id: Optional[str] = None
    ) -> Invoice:
        pre_extracted = {}
        if request.invoice_number:
            pre_extracted["invoice_number"] = request.invoice_number
        if request.vendor_name:
            pre_extracted["vendor_name"] = request.vendor_name
        if request.amount:
            pre_extracted["amount"] = request.amount
        if request.bank_account:
            pre_extracted["bank_account"] = request.bank_account
        if request.routing_number:
            pre_extracted["routing_number"] = request.routing_number
        if request.currency:
            pre_extracted["currency"] = request.currency

        # STEP 1: Invoice Intelligence Agent
        log1 = await self.invoice_agent.analyze(
            raw_content=request.raw_content or "",
            email_thread=request.email_thread_context or "",
            pre_extracted=pre_extracted
        )
        extracted_data = log1["extracted_data"]

        # STEP 2: Vendor Verification Agent
        log2 = await self.vendor_agent.analyze(
            extracted_data=extracted_data,
            db=db
        )
        vendor_data = log2["extracted_data"]
        vendor_record = vendor_data.get("vendor_record", {})
        vendor_id = vendor_record.get("vendor_id") if vendor_record else None

        # STEP 3: Fraud Risk Agent
        log3 = await self.fraud_agent.analyze(
            invoice_agent_result=log1,
            vendor_agent_result=log2,
            email_thread=request.email_thread_context or ""
        )
        fraud_data = log3["extracted_data"]
        risk_score = fraud_data.get("risk_score", 0)
        risk_level = fraud_data.get("risk_level", "LOW")
        risk_factors = fraud_data.get("risk_factors", [])

        # STEP 4: Evidence Validator Agent
        log4 = await self.validator_agent.analyze(
            invoice_agent=log1,
            vendor_agent=log2,
            fraud_agent=log3
        )
        val_data = log4["extracted_data"]
        recommended_action = val_data.get("recommended_action", "HUMAN_REVIEW")
        composite_confidence = val_data.get("composite_confidence", 0.95)
        evidence_summary = val_data.get("evidence_summary", "")

        if recommended_action == "AUTO_CLEAR":
            initial_status = "AUTO_CLEARED"
        elif recommended_action == "HOLD_PAYMENT":
            initial_status = "PAYMENT_HOLD"
        else:
            initial_status = "REVIEW_QUEUE"

        invoice = Invoice(
            invoice_number=extracted_data.get("invoice_number", f"INV-{int(datetime.utcnow().timestamp())}"),
            vendor_id=vendor_id,
            vendor_name_extracted=extracted_data.get("vendor_name", "Unknown Vendor"),
            amount=extracted_data.get("amount", 0.0),
            currency=extracted_data.get("currency", "USD"),
            invoice_date=extracted_data.get("invoice_date"),
            due_date=extracted_data.get("due_date"),
            bank_account=extracted_data.get("bank_account", ""),
            routing_number=extracted_data.get("routing_number", ""),
            bank_name=extracted_data.get("bank_name", ""),
            file_name=request.file_name,
            file_type=request.file_type,
            raw_content=request.raw_content,
            email_thread_context=request.email_thread_context,
            line_items=extracted_data.get("line_items", []),
            status=initial_status,
            risk_score=risk_score,
            risk_level=risk_level,
            confidence_score=composite_confidence,
            risk_factors=risk_factors,
            evidence_summary=evidence_summary,
            recommended_action=recommended_action,
            is_batch=bool(batch_id),
            batch_id=batch_id
        )
        db.add(invoice)
        db.flush()

        for step_idx, log in enumerate([log1, log2, log3, log4], start=1):
            agent_log_row = AgentExecutionLog(
                invoice_id=invoice.id,
                agent_name=log["agent_name"],
                agent_type=log["agent_type"],
                step_number=step_idx,
                status=log["status"],
                verdict=log["verdict"],
                reasoning=log["reasoning"],
                confidence=log["confidence"],
                extracted_data=log.get("extracted_data", {}),
                signals_detected=log.get("signals_detected", []),
                execution_time_ms=log.get("execution_time_ms", 50)
            )
            db.add(agent_log_row)

        audit_trail = PaymentAuditTrail(
            invoice_id=invoice.id,
            action="PIPELINE_ANALYSIS_COMPLETED",
            actor="AP_SENTINEL_AI",
            details=f"Analyzed by 4 AI specialist agents. Risk Score: {risk_score}/100. Action: {recommended_action}."
        )
        db.add(audit_trail)

        db.commit()
        db.refresh(invoice)
        return invoice

    async def run_batch(
        self,
        db: Session,
        invoices_data: List[InvoiceIngestRequest],
        batch_id: str
    ) -> List[Invoice]:
        results = []
        for inv_req in invoices_data:
            inv = await self.run_pipeline(db, inv_req, batch_id=batch_id)
            results.append(inv)
        return results

pipeline = SentinelPipeline()
