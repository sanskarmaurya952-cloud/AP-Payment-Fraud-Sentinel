import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CreditCard, 
  History, 
  Brain, 
  TrendingUp,
  Search,
  CheckCircle2,
  Sparkles,
  Calendar,
  Landmark
} from 'lucide-react';
import { api } from '../../services/api';

export default function VendorHubView() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await api.listVendors();
      setVendors(data);
      if (data.length > 0) {
        setSelectedVendor(data[0]);
        loadVendorProfile(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadVendorProfile = async (id) => {
    try {
      const data = await api.getVendorProfile(id);
      setVendorDetails(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const formatINR = (val) => {
    if (!val) return '₹0.00';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSelectVendor = (v) => {
    setSelectedVendor(v);
    loadVendorProfile(v.id);
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/15 text-purple-400 border border-purple-500/30">
            ADAPTIVE MEMORY ENGINE
          </span>
          <span className="text-xs text-slate-400 font-mono">Indian Enterprise Vendor Knowledge &amp; Baselines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          Vendor Intelligence &amp; Memory Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          The Sentinel system remembers past invoice distributions, historical IFSC bank account revisions, and learns from human approval feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Vendor List Panel */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendor registry (GSTIN/Code)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto">
            {filteredVendors.map((v) => {
              const isSelected = selectedVendor && selectedVendor.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVendor(v)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/15 border-purple-500/50 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold truncate max-w-[170px]">{v.name}</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-bold">
                      {v.code}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Avg: {formatINR(v.avg_invoice_amount)}</span>
                    <span className="text-emerald-400 font-bold">{v.total_invoices_paid} Paid</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Vendor Profile Inspector */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVendor && vendorDetails ? (
            <>
              {/* Vendor Top Overview */}
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-400 shrink-0" /> {selectedVendor.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Code: {selectedVendor.code} • GSTIN: {selectedVendor.tax_id || '27AAACT2727Q1ZW'} • Country: {selectedVendor.country}
                    </p>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                    ✓ Verified Master Vendor
                  </span>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Invoice</span>
                    <span className="text-base font-black text-white font-mono mt-1 block">
                      {formatINR(selectedVendor.avg_invoice_amount)}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Historical Max</span>
                    <span className="text-base font-black text-white font-mono mt-1 block">
                      {formatINR(selectedVendor.max_historical_amount)}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Lifetime Paid</span>
                    <span className="text-base font-black text-emerald-400 font-mono mt-1 block">
                      {selectedVendor.total_invoices_paid}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Spend YTD</span>
                    <span className="text-base font-black text-cyan-400 font-mono mt-1 block">
                      ₹{(selectedVendor.total_spend_ytd / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                </div>

                {/* Registered Banking Coordinates */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Authorized Bank Account:</span>
                    <strong className="text-emerald-400 text-sm">{selectedVendor.verified_bank_account}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bank Name:</span>
                    <strong className="text-white">{selectedVendor.verified_bank_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">IFSC Code:</span>
                    <strong className="text-slate-300">{selectedVendor.verified_routing_number}</strong>
                  </div>
                </div>
              </div>

              {/* Adaptive Feedback Memory Log */}
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" /> Adaptive Feedback Memory Log
                </h3>
                <p className="text-xs text-slate-400">
                  Past human feedback and decisions recorded for this vendor to adapt Sentinel risk thresholds:
                </p>

                {vendorDetails.feedback_memory && vendorDetails.feedback_memory.length > 0 ? (
                  <div className="space-y-3">
                    {vendorDetails.feedback_memory.map((fm, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 text-xs font-mono space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span className="text-purple-300 font-bold">Action: {fm.human_action}</span>
                          <span>Score: {fm.original_risk_score}/100</span>
                        </div>
                        <p className="text-slate-200">{fm.learned_context || fm.feedback_reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono text-center">
                    No anomalous feedback events recorded. Vendor operates strictly within historical baseline tolerances.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-slate-400 font-mono text-xs bg-slate-900/60 rounded-2xl border border-slate-800">
              Select a vendor to inspect memory profile.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
