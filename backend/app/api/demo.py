import random
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.models import Vendor, Invoice, BankChangeHistory
from app.schemas import InvoiceIngestRequest
from app.pipeline.sentinel_pipeline import pipeline

router = APIRouter(prefix="/demo", tags=["Demo & Scenarios"])

@router.post("/run-scenario/{scenario_key}")
async def run_demo_scenario(scenario_key: str, db: Session = Depends(get_db)):
    if scenario_key == "bec_bank_switch":
        req = InvoiceIngestRequest(
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
    elif scenario_key == "amount_spike":
        req = InvoiceIngestRequest(
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
    elif scenario_key == "safe_routine":
        req = InvoiceIngestRequest(
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
    elif scenario_key == "shell_vendor":
        req = InvoiceIngestRequest(
            file_name="INV-APEX-8802_CloudAdv.pdf",
            file_type="pdf",
            invoice_number="INV-APEX-8802",
            vendor_name="Apex Cloud Dynamics Pvt Ltd",
            amount=2480000.0,
            currency="INR",
            bank_account="77112299334411",
            routing_number="YESB0000123",
            bank_name="Yes Bank Mumbai Branch",
            raw_content="""PROFORMA INVOICE #INV-APEX-8802
Vendor: Apex Cloud Dynamics Pvt Ltd
GSTIN: 07AAPCA9921K1ZN
Amount: ₹24,80,000.00 INR
Line Items:
- Enterprise Cloud Advisory & Strategic Architecture Retainer: ₹24,80,000.00
Remit To:
Yes Bank Mumbai Branch
Account: 77112299334411
IFSC: YESB0000123""",
            email_thread_context="New vendor onboarding invoice submitted without prior purchase order."
        )
    else:
        req = InvoiceIngestRequest(
            invoice_number=f"INV-IND-{random.randint(10000, 99999)}",
            vendor_name="Tata Tech Solutions Pvt Ltd",
            amount=500000.0,
            currency="INR",
            bank_account="50100239481928",
            routing_number="HDFC0000060"
        )

    invoice = await pipeline.run_pipeline(db, req)
    return invoice

@router.post("/seed-batch-demo")
async def seed_batch_100_demo(db: Session = Depends(get_db)):
    vendors = db.query(Vendor).all()
    if not vendors:
        return {"error": "Please seed vendors first"}

    sample_invoices = []
    for i in range(1, 101):
        v = random.choice(vendors)
        rand_val = random.random()
        if rand_val < 0.08:
            inv = InvoiceIngestRequest(
                invoice_number=f"BATCH-INV-{10000 + i}",
                vendor_name=v.name,
                amount=round(v.avg_invoice_amount * random.uniform(3.5, 6.0), 2),
                currency="INR",
                bank_account=f"MULE-ACC-{random.randint(10000000, 99999999)}",
                routing_number="MAHB0001928",
                bank_name="Unverified Cooperative Bank",
                raw_content=f"Batch Invoice {i} for {v.name}",
                email_thread_context="Urgent wire request to unverified mule account"
            )
        elif rand_val < 0.25:
            inv = InvoiceIngestRequest(
                invoice_number=f"BATCH-INV-{10000 + i}",
                vendor_name=v.name,
                amount=round(v.avg_invoice_amount * random.uniform(2.1, 2.9), 2),
                currency="INR",
                bank_account=v.verified_bank_account,
                routing_number=v.verified_routing_number,
                bank_name=v.verified_bank_name,
                raw_content=f"Batch Invoice {i} for {v.name}"
            )
        else:
            inv = InvoiceIngestRequest(
                invoice_number=f"BATCH-INV-{10000 + i}",
                vendor_name=v.name,
                amount=round(v.avg_invoice_amount * random.uniform(0.8, 1.2), 2),
                currency="INR",
                bank_account=v.verified_bank_account,
                routing_number=v.verified_routing_number,
                bank_name=v.verified_bank_name,
                raw_content=f"Routine Batch Invoice {i} for {v.name}"
            )
        sample_invoices.append(inv)

    batch_id = "BATCH-ENTERPRISE-100"
    invoices = await pipeline.run_batch(db, sample_invoices, batch_id=batch_id)
    
    safe_cnt = sum(1 for inv in invoices if inv.risk_level == "LOW")
    rev_cnt = sum(1 for inv in invoices if inv.risk_level == "MEDIUM")
    fraud_cnt = sum(1 for inv in invoices if inv.risk_level == "HIGH")

    return {
        "batch_id": batch_id,
        "total_processed": len(invoices),
        "safe_count": safe_cnt,
        "review_count": rev_cnt,
        "fraud_hold_count": fraud_cnt,
        "total_money_protected": sum(inv.amount for inv in invoices if inv.risk_level == "HIGH"),
        "currency": "INR",
        "message": "Successfully processed 100 enterprise invoices through Sentinel AI Pipeline."
    }
