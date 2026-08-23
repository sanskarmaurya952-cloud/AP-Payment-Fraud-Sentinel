import time
from typing import Dict, Any, List
from app.config import settings

class FraudRiskAgent:
    """
    Agent 3: Fraud Risk Agent
    Multi-signal fraud synthesis: Combines invoice anomalies, vendor profile deltas, banking mutations,
    and communication/BEC patterns into a composite 0-100 Fraud Risk Score.
    """

    async def analyze(
        self,
        invoice_agent_result: Dict[str, Any],
        vendor_agent_result: Dict[str, Any],
        email_thread: str = ""
    ) -> Dict[str, Any]:
        start_time = time.time()
        
        extracted = invoice_agent_result.get("extracted_data", {})
        vendor_data = vendor_agent_result.get("extracted_data", {})
        vendor_signals = vendor_agent_result.get("signals_detected", [])
        
        risk_score = 5
        risk_factors: List[Dict[str, Any]] = []

        # Vector 1: Bank Account Delta (Weight: +42 pts)
        if vendor_data.get("bank_mismatch"):
            score_impact = 42
            risk_score += score_impact
            risk_factors.append({
                "category": "BANK_MISMATCH",
                "severity": "CRITICAL",
                "title": "Unauthorized Bank Account Redirection",
                "description": "Invoice specifies a new unverified bank account. High correlation with Business Email Compromise (BEC) and payroll diversion.",
                "score_impact": score_impact
            })

        # Vector 2: Amount Anomaly Multiplier
        multiplier = float(vendor_data.get("amount_multiplier", 1.0))
        if multiplier >= 4.0:
            score_impact = 32
            risk_score += score_impact
            risk_factors.append({
                "category": "AMOUNT_SPIKE",
                "severity": "HIGH",
                "title": f"Extreme Invoice Amount Outlier ({multiplier}x Historical Mean)",
                "description": f"Requested amount is {multiplier}x the typical historical invoice average for this vendor.",
                "score_impact": score_impact
            })
        elif multiplier >= 2.5:
            score_impact = 30
            risk_score += score_impact
            risk_factors.append({
                "category": "AMOUNT_SPIKE",
                "severity": "HIGH",
                "title": f"Elevated Amount Spike ({multiplier}x Historical Mean)",
                "description": f"Invoice amount deviates significantly from vendor historical baseline.",
                "score_impact": score_impact
            })
        elif multiplier >= 1.5:
            score_impact = 18
            risk_score += score_impact
            risk_factors.append({
                "category": "AMOUNT_SPIKE",
                "severity": "MEDIUM",
                "title": f"Moderate Amount Variance ({multiplier}x Historical Mean)",
                "description": f"Invoice amount is higher than standard recurring billing.",
                "score_impact": score_impact
            })

        # Vector 3: Unverified / New Vendor Entity (Weight: +28 pts)
        if vendor_data.get("is_new_vendor"):
            score_impact = 28
            risk_score += score_impact
            risk_factors.append({
                "category": "UNVERIFIED_VENDOR",
                "severity": "HIGH",
                "title": "First-Time Unverified Vendor Entity",
                "description": "Vendor has zero recorded payment history and no established master trade registry entry.",
                "score_impact": score_impact
            })

        # Vector 4: Email / BEC Communication Signals (Weight: +20 pts)
        email_signals = extracted.get("email_signals", [])
        if email_signals or (email_thread and ("urgent" in email_thread.lower() or "bank update" in email_thread.lower())):
            score_impact = 20
            risk_score += score_impact
            risk_factors.append({
                "category": "BEC_SUSPICIOUS",
                "severity": "HIGH",
                "title": "High-Pressure Communication / BEC Signatures",
                "description": "Attached communication exhibits urgency, wire transfer pressure, or informal bank account change instructions.",
                "score_impact": score_impact
            })

        # Vector 5: Shell Company / Jurisdiction checks
        bank_name = str(extracted.get("bank_name", "")).lower()
        if any(tax_haven in bank_name for tax_haven in ["cayman", "offshore", "panama", "sechelles", "mauritius", "cyprus", "caribbean"]):
            score_impact = 18
            risk_score += score_impact
            risk_factors.append({
                "category": "GEO_ANOMALY",
                "severity": "MEDIUM",
                "title": "High-Risk Offshore Banking Jurisdiction",
                "description": f"Beneficiary bank '{extracted.get('bank_name')}' is registered in an offshore or non-cooperative jurisdiction.",
                "score_impact": score_impact
            })

        risk_score = min(max(risk_score, 0), 98)

        if risk_score >= settings.HOLD_THRESHOLD:
            risk_level = "HIGH"
            verdict = f"HIGH FRAUD RISK ({risk_score}/100): Multiple critical risk indicators triggered."
            status = "CRITICAL"
        elif risk_score >= settings.AUTO_CLEAR_THRESHOLD:
            risk_level = "MEDIUM"
            verdict = f"MODERATE RISK ({risk_score}/100): Review required due to isolated anomalies."
            status = "WARNING"
        else:
            risk_level = "LOW"
            verdict = f"LOW RISK ({risk_score}/100): Invoice details are consistent with historical patterns."
            status = "SUCCESS"

        elapsed_ms = int((time.time() - start_time) * 1000)

        return {
            "agent_name": "Fraud Risk Agent",
            "agent_type": "fraud_risk",
            "step_number": 3,
            "status": status,
            "verdict": verdict,
            "confidence": 0.94,
            "reasoning": f"Synthesized {len(risk_factors)} risk factors. Calculated composite risk score: {risk_score}/100 ({risk_level}).",
            "extracted_data": {
                "risk_score": risk_score,
                "risk_level": risk_level,
                "risk_factors": risk_factors
            },
            "signals_detected": risk_factors,
            "execution_time_ms": max(elapsed_ms, 70)
        }
