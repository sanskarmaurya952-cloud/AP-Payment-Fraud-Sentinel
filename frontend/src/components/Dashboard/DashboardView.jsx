import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight, 
  Zap, 
  Clock, 
  FileText, 
  Building, 
  RefreshCw, 
  Cpu, 
  Layers,
  ShieldAlert,
  SlidersHorizontal,
  Lock,
  Landmark
} from 'lucide-react';
import { api } from '../../services/api';

export default function DashboardView({ onSelectInvoice, onNavigateTab, onRunDemo }) {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, invoiceData] = await Promise.all([
        api.getDashboardStats(),
        api.listInvoices()
      ]);
      setStats(statsData);
      setInvoices(invoiceData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatINR = (val) => {
    if (!val) return '₹0.00';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filterRisk === 'ALL') return true;
    return inv.risk_level === filterRisk;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & 1-Click Demo Launcher */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/90 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/15 text-red-400 border border-red-500/30">
                <Cpu className="w-3.5 h-3.5 mr-1.5 animate-spin" style={{ animationDuration: '4s' }} /> 4 AI SPECIALIST AGENTS ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">Indian Enterprise AP Sentinel • GSTIN &amp; IFSC Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Accounts Payable Fraud Sentinel
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Autonomous AI defense intercepting unauthorized vendor bank account mutations, Business Email Compromise (BEC), and invoice tampering before funds leave the company.
            </p>
          </div>

          {/* Quick Demo Attack Triggers in INR */}
          <div className="w-full lg:w-auto flex flex-col gap-2.5 bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800/90 shadow-lg">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Interactive Indian Attack Scenarios:
            </span>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              <button
                onClick={() => onRunDemo('bec_bank_switch')}
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                <span>🔴 Tata BEC (₹48.2L)</span>
              </button>
              <button
                onClick={() => onRunDemo('amount_spike')}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center justify-center gap-1 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>🟠 Mahindra Surge (₹28.4L)</span>
              </button>
              <button
                onClick={() => onRunDemo('safe_routine')}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center justify-center gap-1 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>🟢 Infosys BPM (₹3.2L)</span>
              </button>
              <button
                onClick={() => onNavigateTab('batch')}
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition-all flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Batch 100x Scale</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Executive Metric Cards in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Invoices */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Invoices</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-mono tracking-tight">
                {stats ? stats.total_invoices.toLocaleString('en-IN') : '1,284'}
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center">
                +12.4% <TrendingUp className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Indian enterprise intake</p>
          </div>
        </div>

        {/* Processed Invoices */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processed By AI</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                {stats ? stats.processed_invoices.toLocaleString('en-IN') : '1,251'}
              </span>
              <span className="text-xs text-emerald-400 font-bold">97.4% Auto</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Across 4 specialist agents</p>
          </div>
        </div>

        {/* Flagged Invoices */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged For Review</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                {stats ? stats.flagged_invoices.toLocaleString('en-IN') : '33'}
              </span>
              <span className="text-xs text-amber-400 font-bold">Human Review</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Payment hold or review queue</p>
          </div>
        </div>

        {/* Money Protected in ₹ Crores / Lakhs */}
        <div className="bg-gradient-to-br from-red-950/50 via-slate-900 to-slate-900 border border-red-500/40 rounded-2xl p-5 shadow-xl shadow-red-950/30 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-28 h-28 bg-red-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Protected Funds
            </span>
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-mono tracking-tight">
                ₹{stats ? (stats.money_protected / 10000000).toFixed(2) + ' Cr' : '₹1.84 Cr'}
              </span>
              <span className="text-[10px] text-red-300 font-extrabold px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                PAYMENT HOLD
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 font-mono">Intercepted before fund release</p>
          </div>
        </div>

      </div>

      {/* Threat Triage & Vector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Triage Breakdown */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Autonomous Risk Triage
            </h3>
            <p className="text-xs text-slate-400 mb-5">Categorization by Sentinel Multi-Agent Pipeline</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-emerald-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe / Auto-Cleared (&lt;30)
                  </span>
                  <span className="text-slate-300 font-mono">1,218 (94.8%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-amber-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Review Queue (30 - 70)
                  </span>
                  <span className="text-slate-300 font-mono">26 (2.0%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '2.0%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-red-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> High Fraud Hold (&gt;70)
                  </span>
                  <span className="text-slate-300 font-mono">7 (3.2%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '3.2%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Autonomous Confidence: <strong className="text-white">98.2%</strong></span>
            <span>Avg Latency: <strong className="text-white">142ms</strong></span>
          </div>
        </div>

        {/* Fraud Attack Categories */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Intercepted Threat Vectors (India YTD)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Detected accounts payable fraud patterns across registered vendors</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-red-500/25">
              <span className="text-[11px] font-bold text-slate-400 block">Bank &amp; IFSC Delta</span>
              <span className="text-xl font-black text-red-400 font-mono mt-1 block">14 Alerts</span>
              <span className="text-[10px] text-slate-500 font-mono">Unregistered IFSC</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/25">
              <span className="text-[11px] font-bold text-slate-400 block">Amount Multiplier</span>
              <span className="text-xl font-black text-amber-400 font-mono mt-1 block">11 Alerts</span>
              <span className="text-[10px] text-slate-500 font-mono">&gt;3x historical mean</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-orange-500/25">
              <span className="text-[11px] font-bold text-slate-400 block">Unverified Vendor</span>
              <span className="text-xl font-black text-orange-400 font-mono mt-1 block">5 Alerts</span>
              <span className="text-[10px] text-slate-500 font-mono">Missing PO history</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/25">
              <span className="text-[11px] font-bold text-slate-400 block">BEC Impersonation</span>
              <span className="text-xl font-black text-purple-400 font-mono mt-1 block">3 Alerts</span>
              <span className="text-[10px] text-slate-500 font-mono">Urgency spoofing</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-red-950/25 border border-red-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping shrink-0"></span>
              <span className="text-xs font-extrabold text-red-200">Active High-Severity Alert: #INV-TATA-10291 (Tata Tech Solutions - ₹48,20,000)</span>
            </div>
            <button
              onClick={() => onSelectInvoice(1)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
            >
              Inspect Evidence <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Live Invoices & Sentinel Alerts Table in INR */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" /> Live Invoices &amp; Sentinel Alerts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time evaluation stream from the 4-agent security pipeline</p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterRisk('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterRisk === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRisk('HIGH')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterRisk === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                🔴 High
              </button>
              <button
                onClick={() => setFilterRisk('MEDIUM')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterRisk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                🟠 Review
              </button>
              <button
                onClick={() => setFilterRisk('LOW')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterRisk === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              >
                🟢 Safe
              </button>
            </div>

            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5">Risk Level</th>
                <th className="py-4 px-5">Invoice #</th>
                <th className="py-4 px-5">Vendor Name</th>
                <th className="py-4 px-5">Amount (INR)</th>
                <th className="py-4 px-5">Risk Score</th>
                <th className="py-4 px-5">Action Route</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Evidence Deep Dive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
              {filteredInvoices.map((inv) => {
                const isHigh = inv.risk_level === 'HIGH';
                const isMed = inv.risk_level === 'MEDIUM';
                const isSafe = inv.risk_level === 'LOW';

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => onSelectInvoice(inv.id)}
                  >
                    <td className="py-4 px-5 font-bold whitespace-nowrap">
                      {isHigh && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-red-500/15 text-red-400 border border-red-500/30">
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                          🔴 HIGH RISK
                        </span>
                      )}
                      {isMed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          🟠 MEDIUM
                        </span>
                      )}
                      {isSafe && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          🟢 SAFE
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 font-mono font-bold text-white whitespace-nowrap">
                      {inv.invoice_number}
                    </td>

                    <td className="py-4 px-5 text-slate-200">
                      <div className="flex items-center gap-2 max-w-[220px] truncate">
                        <Building className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{inv.vendor_name_extracted}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-mono font-extrabold text-white whitespace-nowrap text-sm">
                      {formatINR(inv.amount)}
                    </td>

                    <td className="py-4 px-5 font-mono font-bold whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg ${isHigh ? 'text-red-400 bg-red-500/10 border border-red-500/20' : isMed ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'}`}>
                        {inv.risk_score} / 100
                      </span>
                    </td>

                    <td className="py-4 px-5 font-bold whitespace-nowrap">
                      {inv.recommended_action === 'HOLD_PAYMENT' && <span className="text-red-400">⛔ HOLD PAYMENT</span>}
                      {inv.recommended_action === 'HUMAN_REVIEW' && <span className="text-amber-300">👤 Human Review</span>}
                      {inv.recommended_action === 'AUTO_CLEAR' && <span className="text-emerald-400">⚡ Auto-Clear</span>}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      {inv.reviewer_decision === 'VERIFIED_AND_RELEASED' && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                          ✓ Released
                        </span>
                      )}
                      {inv.reviewer_decision === 'REJECTED_FRAUD' && (
                        <span className="text-[11px] font-bold text-red-400 bg-red-500/15 px-2.5 py-1 rounded-full border border-red-500/30">
                          ⛔ Blocked
                        </span>
                      )}
                      {!inv.reviewer_decision && (
                        <span className="text-xs text-slate-400 font-mono">
                          {inv.status}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-red-400 font-bold group-hover:translate-x-1 transition-transform">
                        Inspect Evidence <ChevronRight className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
