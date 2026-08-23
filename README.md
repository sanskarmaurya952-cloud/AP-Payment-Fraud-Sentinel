# 🛡️ AP Payment Fraud Sentinel
> **Autonomous Multi-Agent Accounts-Payable Security & Payment Interceptor**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An AI-powered accounts-payable security engine that detects invoice tampering, unauthorized vendor bank/IFSC account modifications, and Business Email Compromise (BEC) wire diversions **before funds leave the company**.

---

## 🎯 System Architecture & 4-Agent Pipeline

```
Incoming Invoices & Mixed Media
(GST Tax Invoices, PDF OCR, Spoofed BEC Emails)
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SENTINEL MULTI-AGENT PIPELINE              │
│                                                         │
│  🤖 Agent 1: Invoice Intelligence Agent                 │
│     Extracts GSTIN, Vendor, IFSC, Bank Acct, Amount, PO │
│                     │                                   │
│  🔍 Agent 2: Vendor Verification Agent                  │
│     Cross-references Master Registry & Bank Deltas      │
│                     │                                   │
│  🧠 Agent 3: Fraud Risk Agent                           │
│     Multi-Signal Synthesis -> Composite Risk Score 0-100│
│                     │                                   │
│  🛡️ Agent 4: Evidence Validator Agent                   │
│     Calibrates Confidence & Enforces Policy Routing     │
└────────────────────────────┬────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   🟢 Risk < 30                      🔴 Risk >= 70
┌──────────────────────┐          ┌──────────────────────┐
│     AUTO-CLEARED     │          │ MANDATORY HOLD       │
│  Immediate Release   │          │ Human Verification   │
└──────────────────────┘          └──────────┬───────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │ 👤 Human-In-The-Loop Hub  │
                               │ [Reject] [Verify] [Audit] │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │ 🧠 Adaptive Vendor Memory │
                               │ Learns New Risk Baselines │
                               └───────────────────────────┘
```

---

## 🤖 The 4 Specialist AI Agents

1. **🤖 Agent 1: Invoice Intelligence Agent**
   - Parses mixed-media sources (PDFs, OCR transcripts, approval emails).
   - Extracts structured financial entities: Vendor Name, GSTIN, PAN, Invoice Number, Amount (₹ INR), Due Date, Bank Account, IFSC Code, and Line Items.
2. **🔍 Agent 2: Vendor Verification Agent**
   - Cross-references incoming invoice against the vendor master registry.
   - Detects **Bank Account & IFSC Deltas** (identifying when an invoice requests remittance to an unverified or unauthorized bank).
   - Calculates historical amount variance ($Z$-score / multiplier over baseline).
3. **🧠 Agent 3: Fraud Risk Engine**
   - Multi-signal risk synthesis combining:
     - Bank Account & IFSC Redirection (`+42 pts`)
     - Historical Amount Outlier (`+32 pts`)
     - Unverified Shell Vendor (`+28 pts`)
     - Urgent BEC Email Pressure (`+20 pts`)
     - Non-cooperative Banking Jurisdiction (`+18 pts`)
   - Computes composite **Fraud Risk Score (0–100)** and severity tier (`LOW`, `MEDIUM`, `HIGH`).
4. **🛡️ Agent 4: Evidence Validator Agent**
   - Calibrates confidence scores (e.g. 96%).
   - Prevents hallucinations and enforces policy gates:
     - `Risk < 30`: **Auto-Clear**
     - `Risk 30–70`: **Review Queue**
     - `Risk >= 70`: **Payment HOLD**

---

## 🌟 Key Features & Views

### 1. 📊 Executive Dashboard
- **Top KPI Cards**: Total Invoices, Processed By AI (97.4% automated), Flagged for Review, and **Protected Funds (₹1.84+ Crores in Payment HOLD)**.
- **Autonomous Risk Triage & Threat Vector Breakdown**: Safe (94.8%), Review Queue (2.0%), High Fraud Hold (3.2%).
- **Live Alert Feed**: Real-time evaluation stream with 1-click jump to full evidence.

### 2. 🔍 Invoice Deep Dive & Evidence Inspector (Judge Spotlight)
- **Circular 0–100 Risk Gauge**: High-contrast visual meter with severity badge.
- **Interactive 4-Agent Audit Trail**: Step-by-step reasoning cards showing execution time, detected signals, and verdicts.
- **Side-by-Side Bank Delta Comparison**: Verified Master Account (e.g. *HDFC Bank `50100239481928`*) vs Fraudulent Invoice Remittance (*Unverified Cooperative Bank `98765432109822`* highlighted in red).
- **Mixed Media Viewer**: Toggle between GST Invoice document text and attached Spoofed BEC Email thread.
- **Human-In-The-Loop Governance Center**:
  - `[ ⛔ Reject Payment & Block ]`
  - `[ ✓ Verify & Release Payment ]`
  - `[ ❓ Request Supplier Callback ]`
- **Immutable Cryptographic Audit Trail**: Full ledger of automated pipeline runs and human actions.

### 3. ⚡ High-Throughput Batch Processing (100x Scale)
- **100-Invoice Batch Demo**: Ingests and processes 100 enterprise invoices concurrently in under 2 seconds.
- **Batch Results Triage**: 🟢 83+ Safe Auto-Paid, 🟡 8 Review Queue, 🔴 9 Fraud Holds (**₹3.96+ Crores Protected**).

### 4. 🏢 Vendor Intelligence & Adaptive Memory Hub
- Searchable vendor directory with risk profiles, lifetime invoice volumes, and registered IFSC coordinates.
- **Adaptive Feedback Memory**: Records human reviewer verdicts (e.g., telephone verification) to dynamically adjust future risk baselines.

### 5. 🎯 1-Click Live Indian Threat Scenarios
- 🔴 **Tata BEC Attack**: ₹48,20,000 (Mule Account Redirect) $\rightarrow$ **Risk 98/100 • Payment HOLD**.
- 🟠 **Mahindra Surge Charge**: ₹28,40,000 (3.34× Baseline Anomaly) $\rightarrow$ **Risk 35/100 • Human Review**.
- 🟢 **Infosys BPM Maintenance**: ₹3,20,000 (Clean ICICI Match) $\rightarrow$ **Risk 5/100 • Auto-Cleared**.
- 🟠 **Apex Cloud Retainer**: ₹24,80,000 (Unverified First-time Vendor) $\rightarrow$ **Risk 33/100 • Review Queue**.

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`

### 🔧 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be live at:
- **API Server**: `http://127.0.0.1:8000`
- **Swagger Interactive Docs**: `http://127.0.0.1:8000/docs`

---

### 🎨 2. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Frontend will be live at:
- **Web Dashboard**: `http://127.0.0.1:5173/`

---

## 🧪 Running Automated Tests

```bash
cd backend
python -m pytest -v tests/test_sentinel.py
```

Test verification results:
```
tests/test_sentinel.py::test_bec_fraud_detection PASSED                  [ 33%]
tests/test_sentinel.py::test_safe_invoice_autoclear PASSED               [ 66%]
tests/test_sentinel.py::test_human_in_the_loop_approval_and_memory PASSED [100%]
======================= 3 passed in 0.98s ========================
```

---

## 📂 Project Structure

```
ap-fraud-sentinel/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── base.py                   # LLM provider & fallback engine
│   │   │   ├── invoice_intelligence.py   # Agent 1: Entity extraction
│   │   │   ├── vendor_verification.py    # Agent 2: Registry & Bank delta check
│   │   │   ├── fraud_risk_agent.py       # Agent 3: Multi-signal 0-100 scoring
│   │   │   └── evidence_validator.py     # Agent 4: Rigor & threshold router
│   │   ├── api/
│   │   │   ├── invoices.py               # Invoice endpoints
│   │   │   ├── dashboard.py              # KPI stats endpoints
│   │   │   ├── batch.py                  # Batch parallel processing
│   │   │   ├── vendors.py                # Vendor memory hub
│   │   │   └── demo.py                   # Live scenario triggers
│   │   ├── pipeline/
│   │   │   ├── sentinel_pipeline.py      # Pipeline orchestrator
│   │   │   └── memory.py                 # Adaptive feedback loop
│   │   ├── config.py                     # App configuration
│   │   ├── database.py                   # Database session setup
│   │   ├── models.py                     # SQLAlchemy models
│   │   ├── schemas.py                    # Pydantic v2 schemas
│   │   └── main.py                       # FastAPI entrypoint & seeder
│   ├── tests/
│   │   └── test_sentinel.py              # Automated test suite
│   └── requirements.txt                  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Navigation bar
│   │   │   ├── Dashboard/DashboardView.jsx # Executive KPI Dashboard
│   │   │   ├── InvoiceDetail/InvoiceDetailView.jsx # Deep Dive & Judge View
│   │   │   ├── BatchProcessing/BatchView.jsx # 100x Batch Scale View
│   │   │   ├── VendorHub/VendorHubView.jsx # Vendor Intelligence & Memory
│   │   │   └── Demo/DemoView.jsx         # Live Attack Simulator
│   │   ├── services/
│   │   │   └── api.js                    # API client
│   │   ├── App.jsx                       # Root React application
│   │   └── index.css                     # Tailwind CSS & Theme styles
│   ├── package.json                      # Node dependencies
│   └── vite.config.js                    # Vite configuration
├── .gitignore                            # Git ignore rules
└── README.md                             # Project Documentation
```

---

## 📜 License
This project is licensed under the MIT License.
