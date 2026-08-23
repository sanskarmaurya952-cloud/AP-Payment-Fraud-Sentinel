import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Play,
  Cpu,
  RefreshCw,
  Sparkles,
  Landmark
} from 'lucide-react';
import { api } from '../../services/api';

export default function DemoView({ onSelectInvoice, onNavigateTab }) {
  const [runningKey, setRunningKey] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const handleLaunchScenario = async (key) => {
    try {
      setRunningKey(key);
      const res = await api.runDemoScenario(key);
      setLastResult(res);
    } catch (err) {
      console.error('Scenario failed:', err);
    } finally {
      setRunningKey(null);
    }
  };

  const formatINR = (val) => {
    if (!val) return '₹0.00';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const scenarios = [
    {
      key: 'bec_bank_switch',
      badge: 'HIGH SEVERITY ATTACK',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      title: 'BEC Executive Impersonation & Bank Account Switch',
      vendor: 'Tata Tech Solutions Pvt Ltd',
      amount: '₹48,20,000.00 INR',
      expectedScore: '🔴 98 / 100 (Payment HOLD)',
      description: 'Attacker compromises supplier email, sends urgent request to wire ₹48.2 Lakhs (4.8x avg) to a newly opened cooperative mule bank account instead of registered HDFC account.',
      vectors: ['Bank & IFSC Delta', 'Amount Outlier (4.8x)', 'Urgent Email Pressure', 'Cooperative Mule Bank']
    },
    {
      key: 'amount_spike',
      badge: 'MODERATE ANOMALY',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      title: 'Historical Amount Inflation & Surge Anomaly',
      vendor: 'Mahindra Logistics Ltd',
      amount: '₹28,40,000.00 INR',
      expectedScore: '🟠 35 / 100 (Human Review)',
      description: 'Vendor SBI bank account & IFSC are verified, but invoice amount is 3.34x elevated compared to historical monthly volume due to surge freight charges. Sentinel queues for review.',
      vectors: ['Amount Multiplier (>3x)', 'Verified SBI IFSC Match', 'Standard Deviation Surge']
    },
    {
      key: 'safe_routine',
      badge: 'ROUTINE SAFE PAYMENT',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'Legitimate Recurring IT/BPM Maintenance Invoice',
      vendor: 'Infosys BPM Services',
      amount: '₹3,20,000.00 INR',
      expectedScore: '🟢 5 / 100 (Auto-Cleared)',
      description: '100% matched registered ICICI Bank account and IFSC, exact historical amount match, recurring PO baseline verified. Auto-cleared for immediate disbursement.',
      vectors: ['ICICI Account Matched', 'Within 1 StdDev', '36 Prior Paid Invoices']
    },
    {
      key: 'shell_vendor',
      badge: 'UNREGISTERED SHELL ENTITY',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      title: 'First-Time Shell Vendor Without Prior PO',
      vendor: 'Apex Cloud Dynamics Pvt Ltd',
      amount: '₹24,80,000.00 INR',
      expectedScore: '🟠 51 / 100 (Human Review)',
      description: 'Unrecognized vendor name submitted invoice with Yes Bank Mumbai routing and missing purchase order documentation.',
      vectors: ['Unverified Vendor Entity', 'Zero Trade Credit History', 'Missing Prior PO']
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
            INTERACTIVE BENCHMARK SUITE (INDIA)
          </span>
          <span className="text-xs text-slate-400 font-mono">1-Click Live Threat Testing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          Live Attack &amp; Scenario Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Trigger realistic accounts payable attack vectors and observe how the 4-agent Sentinel pipeline intercepts Indian corporate fraud in real-time.
        </p>
      </div>

      {/* Latest Result Banner */}
      {lastResult && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border-2 border-red-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider block">
              ⚡ Execution Result: #{lastResult.invoice_number}
            </span>
            <div className="text-base font-black text-white">
              {lastResult.vendor_name_extracted} • {formatINR(lastResult.amount)} • Risk Score: {lastResult.risk_score}/100 ({lastResult.risk_level})
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">{lastResult.evidence_summary}</p>
          </div>

          <button
            onClick={() => onSelectInvoice(lastResult.id)}
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/30 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <span>Inspect Evidence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((sc) => (
          <div
            key={sc.key}
            className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${sc.badgeColor}`}>
                  {sc.badge}
                </span>
                <span className="text-xs font-mono font-black text-white">{sc.amount}</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white leading-snug">{sc.title}</h3>
              <p className="text-xs text-slate-300 font-mono">Target Vendor: <strong className="text-white">{sc.vendor}</strong></p>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                {sc.description}
              </p>

              {/* Vectors */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {sc.vectors.map((vec, i) => (
                  <span key={i} className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800/90">
                    {vec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-bold font-mono text-slate-300">
                Expected: <strong className="text-white">{sc.expectedScore}</strong>
              </span>

              <button
                disabled={runningKey === sc.key}
                onClick={() => handleLaunchScenario(sc.key)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {runningKey === sc.key ? <Cpu className="w-4 h-4 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{runningKey === sc.key ? 'Analyzing...' : 'Run Scenario'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
