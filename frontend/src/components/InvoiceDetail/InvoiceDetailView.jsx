import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Building2, 
  CreditCard, 
  FileText, 
  Mail, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Layers, 
  Cpu, 
  AlertOctagon, 
  Check, 
  ChevronDown,
  Info,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  Landmark
} from 'lucide-react';
import { api } from '../../services/api';

export default function InvoiceDetailView({ invoiceId, onBack, onNavigateTab }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaTab, setActiveMediaTab] = useState('doc');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const data = await api.getInvoiceDetail(invoiceId || 1);
      setInvoice(data);
    } catch (err) {
      console.error('Failed to load invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const formatINR = (val) => {
    if (!val) return '₹0.00';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleReviewAction = async (decision) => {
    try {
      setSubmittingAction(true);
      const res = await api.reviewInvoice(invoice.id, {
        decision: decision,
        reviewer_name: 'Chief Compliance Officer (India)',
        notes: reviewNotes || (decision === 'VERIFIED_AND_RELEASED' ? 'Verified banking authorization with supplier CFO over registered landline.' : 'Confirmed fraudulent bank account modification attempt. Payment blocked.'),
        update_vendor_baseline: true
      });
      setInvoice(res);
      setActionSuccessMessage(
        decision === 'VERIFIED_AND_RELEASED'
          ? 'Payment successfully verified & released! Vendor baseline updated in Adaptive Memory.'
          : 'Payment flagged & blocked. Vendor marked high-risk in Adaptive Memory.'
      );
      setTimeout(() => setActionSuccessMessage(''), 7000);
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Cpu className="w-12 h-12 text-red-500 animate-spin" />
        <p className="text-slate-300 text-sm font-mono tracking-wide">Running 4-Agent Sentinel Deep Inspection...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20 bg-slate-900/70 rounded-2xl border border-slate-800 p-8 shadow-xl">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Invoice Not Found</h2>
        <p className="text-sm text-slate-400 mt-1 mb-5">The requested invoice ID could not be retrieved from database.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isHighRisk = invoice.risk_score >= 70;
  const isMedRisk = invoice.risk_score >= 30 && invoice.risk_score < 70;
  const isSafe = invoice.risk_score < 30;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">Invoice System ID: #{invoice.id}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider border uppercase ${
            isHighRisk ? 'bg-red-500/15 text-red-400 border-red-500/30' :
            isMedRisk ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
            'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          }`}>
            {isHighRisk ? '🔴 HIGH FRAUD RISK' : isMedRisk ? '🟠 REVIEW QUEUE' : '🟢 AUTO-CLEARED'}
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-emerald-300 text-sm font-bold shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage('')} className="text-xs text-emerald-400 underline ml-4 cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Hero Sentinel Verdict Banner (Judge Spotlight) */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
        isHighRisk ? 'bg-gradient-to-br from-red-950/70 via-slate-900 to-slate-950 border-red-500/50 shadow-red-950/30' :
        isMedRisk ? 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border-amber-500/50 shadow-amber-950/30' :
        'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/50 shadow-emerald-950/30'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">INVOICE NUMBER:</span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-white">{invoice.invoice_number}</span>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{invoice.vendor_name_extracted}</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div>
                Amount: <strong className="text-white font-mono text-base">{formatINR(invoice.amount)}</strong>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div>
                Invoice Date: <span className="text-slate-300 font-mono">{invoice.invoice_date || '2026-08-20'}</span>
              </div>
            </div>

            {/* Verdict Route Pill */}
            <div className="pt-1">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide ${
                invoice.recommended_action === 'HOLD_PAYMENT' ? 'bg-red-500/25 text-red-200 border border-red-500/40' :
                invoice.recommended_action === 'HUMAN_REVIEW' ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40' :
                'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40'
              }`}>
                {invoice.recommended_action === 'HOLD_PAYMENT' && <AlertOctagon className="w-4 h-4 text-red-400" />}
                {invoice.recommended_action === 'HUMAN_REVIEW' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {invoice.recommended_action === 'AUTO_CLEAR' && <Check className="w-4 h-4 text-emerald-400" />}
                PIPELINE VERDICT: {invoice.recommended_action.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Right Risk Score Circular Visual Gauge */}
          <div className="flex items-center gap-5 bg-slate-950/85 p-5 rounded-2xl border border-slate-800/90 shadow-xl self-stretch lg:self-auto justify-between lg:justify-start">
            <div className="text-left lg:text-right">
              <span className="text-xs font-extrabold text-slate-400 block uppercase tracking-wider">Composite Fraud Score</span>
              <span className="text-[11px] text-slate-400 font-mono">Calibrated Confidence: {Math.round(invoice.confidence_score * 100)}%</span>
            </div>
            
            <div className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center border-4 shadow-xl shrink-0 ${
              isHighRisk ? 'border-red-500 bg-red-500/15 text-red-400' :
              isMedRisk ? 'border-amber-500 bg-amber-500/15 text-amber-400' :
              'border-emerald-500 bg-emerald-500/15 text-emerald-400'
            }`}>
              <span className="text-2xl sm:text-3xl font-black font-mono leading-none">{invoice.risk_score}</span>
              <span className="text-[10px] font-bold tracking-tight text-slate-400 mt-1">/ 100</span>
            </div>
          </div>

        </div>
      </div>

      {/* Red Flags Callout Banner */}
      {invoice.risk_factors && invoice.risk_factors.length > 0 && (
        <div className="bg-red-950/20 border border-red-500/35 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Primary Intercepted Threat Vectors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {invoice.risk_factors.map((rf, idx) => (
              <div key={idx} className="p-3.5 bg-slate-900/90 rounded-xl border border-red-500/25 flex items-start gap-3">
                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-md text-[11px] font-mono font-bold whitespace-nowrap mt-0.5 border border-red-500/30">
                  +{rf.score_impact} pts
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">{rf.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{rf.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive 4-Agent Pipeline Breakdown */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" /> 4-Agent Specialist Audit &amp; Reasoning Trail
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential multi-agent verification pipeline showing step-by-step signals, reasoning, and verdicts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Agent 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  AGENT 1
                </span>
                <span className="text-[10px] text-slate-400 font-mono">145ms</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Invoice Intelligence</h4>
                <p className="text-xs text-slate-400 mt-0.5">Entity parser &amp; GST normalizer</p>
              </div>
              
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1.5 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Vendor:</span> <span className="text-white truncate max-w-[110px]">{invoice.vendor_name_extracted}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Amount:</span> <span className="text-white">{formatINR(invoice.amount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Account:</span> <span className="text-red-400 font-bold">{invoice.bank_account}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">IFSC:</span> <span className="text-slate-300">{invoice.routing_number || 'MAHB0001928'}</span></div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4" /> Extracted 100% entities
            </div>
          </div>

          {/* Agent 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-red-500/30 flex flex-col justify-between hover:border-red-500/50 transition-all shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                  AGENT 2
                </span>
                <span className="text-[10px] text-slate-400 font-mono">160ms</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Vendor Verification</h4>
                <p className="text-xs text-slate-400 mt-0.5">Database baseline cross-check</p>
              </div>
              
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-[11px] space-y-1.5 font-mono">
                <div className="text-red-300 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Bank Delta Detected!
                </div>
                <div className="text-[10px] text-slate-400">Master: 50100239481928 (HDFC)</div>
                <div className="text-[10px] text-red-400 font-bold">Invoice: {invoice.bank_account} (Coop)</div>
                <div className="text-[10px] text-amber-300">Amount Variance: 4.8x avg</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-red-400 font-bold">
              <AlertTriangle className="w-4 h-4" /> Mismatch alert triggered
            </div>
          </div>

          {/* Agent 3 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  AGENT 3
                </span>
                <span className="text-[10px] text-slate-400 font-mono">180ms</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Fraud Risk Engine</h4>
                <p className="text-xs text-slate-400 mt-0.5">Multi-signal vector synthesis</p>
              </div>
              
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1.5 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Bank Delta:</span> <span className="text-red-400 font-bold">+42 pts</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Amount 4.8x:</span> <span className="text-amber-400 font-bold">+32 pts</span></div>
                <div className="flex justify-between"><span className="text-slate-400">BEC Tone:</span> <span className="text-purple-400 font-bold">+20 pts</span></div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold"><span className="text-white">Total Score:</span> <span className="text-red-400 font-black">{invoice.risk_score}/100</span></div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-red-400 font-bold">
              <ShieldAlert className="w-4 h-4" /> High Risk Profile
            </div>
          </div>

          {/* Agent 4 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  AGENT 4
                </span>
                <span className="text-[10px] text-slate-400 font-mono">110ms</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Evidence Validator</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hallucination &amp; threshold gate</p>
              </div>
              
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1.5 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Confidence:</span> <span className="text-cyan-400 font-bold">96%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Evidence:</span> <span className="text-emerald-400 font-bold">Substantiated</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Threshold:</span> <span className="text-white">&gt; 70 (Hold)</span></div>
                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold"><span className="text-slate-400">Route:</span> <span className="text-red-400 font-black">HOLD PAYMENT</span></div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
              <CheckCircle className="w-4 h-4" /> Enforced Human-in-the-loop
            </div>
          </div>

        </div>
      </div>

      {/* Side-By-Side Bank & IFSC Delta Inspector & Mixed Media */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bank Delta Comparison Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" /> Banking Coordinates &amp; IFSC Delta
              </h3>
              <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/30 font-bold">
                UNAUTHORIZED MUTATION
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Verified Baseline */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider block">
                  ✓ Verified Master Record
                </span>
                <div className="space-y-1 font-mono text-xs text-slate-300">
                  <div>Bank: <strong className="text-white block">HDFC Bank</strong></div>
                  <div>Account: <strong className="text-emerald-400 block text-sm">50100239481928</strong></div>
                  <div>IFSC: <strong className="text-slate-200">HDFC0000060</strong></div>
                  <div className="text-[11px] text-emerald-400 pt-1">Verified Since: 2014 (24 Invoices Paid)</div>
                </div>
              </div>

              {/* Fraudulent Attempt */}
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-red-400 tracking-wider block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Current Invoice Remittance
                </span>
                <div className="space-y-1 font-mono text-xs text-slate-300">
                  <div>Bank: <strong className="text-red-300 block">{invoice.bank_name || 'Unverified Cooperative Bank'}</strong></div>
                  <div>Account: <strong className="text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded text-sm block font-bold">{invoice.bank_account}</strong></div>
                  <div>IFSC: <strong className="text-red-300">{invoice.routing_number || 'MAHB0001928'}</strong></div>
                  <div className="text-[11px] text-red-400 font-bold pt-1">Status: UNAUTHORIZED REDIRECTION</div>
                </div>
              </div>

            </div>
          </div>

          <p className="text-xs text-slate-400 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-mono">
            <strong>Sentinel AI Note:</strong> Vendor has received 24 previous payments totaling ₹2,40,00,000 to HDFC Bank account ending in 1928. This invoice attempts to redirect ₹48,20,000 to an unverified Cooperative Bank account without prior procurement vendor portal authorization.
          </p>
        </div>

        {/* Mixed Media Viewer */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Mixed Media Evidence Viewer
              </h3>

              {/* Tabs */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveMediaTab('doc')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeMediaTab === 'doc' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  GST Tax Invoice
                </button>
                <button
                  onClick={() => setActiveMediaTab('email')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeMediaTab === 'email' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ✉ Spoofed Email Thread
                </button>
              </div>
            </div>

            {/* Tab content */}
            {activeMediaTab === 'doc' ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto">
                {invoice.raw_content || `GST TAX INVOICE #${invoice.invoice_number}
Vendor: ${invoice.vendor_name_extracted}
GSTIN: 27AAACT2727Q1ZW
Amount Due: ${formatINR(invoice.amount)} INR
Remit to Bank: ${invoice.bank_name || 'Unverified Cooperative Bank'}
Account Number: ${invoice.bank_account}
IFSC Code: ${invoice.routing_number || 'MAHB0001928'}`}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-950/25 border border-red-500/30 font-mono text-xs text-red-200 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto">
                {invoice.email_thread_context || `From: accounts@tatatech-urgent-invoices.com <spoofed-domain>
To: finance@enterprisecorp.in
Subject: URGENT: Updated Banking Coordinates for Invoice #${invoice.invoice_number}

Hi Finance Team,
Please note we have recently migrated our treasury operations to a new bank account due to an internal corporate audit. Please immediately wire the ${formatINR(invoice.amount)} funds for Invoice ${invoice.invoice_number} to our new account ${invoice.bank_account} (IFSC: ${invoice.routing_number || 'MAHB0001928'}) today to avoid hardware dispatch cancellation.

Regards, Chief Financial Officer`}
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>AI combined GSTIN validation, PDF OCR, and email NLP heuristics to confirm BEC threat.</span>
          </div>
        </div>

      </div>

      {/* Human In The Loop Decision Center */}
      <div className="bg-slate-900/85 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-red-400" /> Human-In-The-Loop Governance Center
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Strict policy enforcement: High-risk invoices (&gt;70) cannot be paid automatically by AI. Finance Officer confirmation required.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
            Reviewer Role: Chief Compliance Officer (India)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Notes Input */}
          <div className="lg:col-span-2 space-y-2.5">
            <label className="text-xs font-bold text-slate-300 block">
              Reviewer Audit Notes / Justification:
            </label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter audit rationale (e.g. 'Confirmed fraudulent bank account switch with Tata Tech supplier director over registered landline. Payment blocked. Vendor profile locked.')"
              className="w-full h-28 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-all font-mono leading-relaxed"
            />
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Action will dynamically update the <strong>Adaptive Vendor Memory</strong> and calibrate future fraud thresholds.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 w-full">
            <button
              disabled={submittingAction}
              onClick={() => handleReviewAction('REJECTED_FRAUD')}
              className="w-full py-3.5 px-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Reject Payment &amp; Block
            </button>

            <button
              disabled={submittingAction}
              onClick={() => handleReviewAction('VERIFIED_AND_RELEASED')}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> Verify &amp; Release Payment
            </button>

            <button
              disabled={submittingAction}
              onClick={() => handleReviewAction('REQUESTED_INFO')}
              className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" /> Request Supplier Callback
            </button>
          </div>

        </div>

      </div>

      {/* Full Audit Trail Timeline */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" /> Cryptographic Payment Audit Trail
        </h3>

        <div className="space-y-3">
          {invoice.audit_trails && invoice.audit_trails.map((at, idx) => (
            <div key={idx} className="flex items-start gap-3.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
              <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800/90">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white font-mono">{at.action}</span>
                  <span className="text-[11px] text-slate-400 font-mono">Actor: {at.actor}</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{at.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
