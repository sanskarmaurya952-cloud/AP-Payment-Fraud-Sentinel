import React, { useState } from 'react';
import { 
  Layers, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Play, 
  Cpu, 
  FileText, 
  RefreshCw, 
  ChevronRight, 
  TrendingUp,
  Sparkles,
  Check,
  Landmark
} from 'lucide-react';
import { api } from '../../services/api';

export default function BatchView({ onSelectInvoice }) {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batchResult, setBatchResult] = useState(null);
  const [currentAgentStep, setCurrentAgentStep] = useState('Idle');

  const runBatch100Demo = async () => {
    try {
      setProcessing(true);
      setProgress(10);
      setCurrentAgentStep('Agent 1: Ingesting & OCR parsing 100 Indian enterprise GST invoices...');
      
      setTimeout(() => {
        setProgress(38);
        setCurrentAgentStep('Agent 2: Cross-referencing GSTIN & IFSC baselines across vendor master registry...');
      }, 400);

      setTimeout(() => {
        setProgress(72);
        setCurrentAgentStep('Agent 3: Synthesizing multi-signal Indian BEC risk vectors & surge anomalies...');
      }, 800);

      setTimeout(() => {
        setProgress(90);
        setCurrentAgentStep('Agent 4: Validating evidential rigor & routing rupee disbursement holds...');
      }, 1200);

      const res = await api.seedBatchDemo();
      
      setProgress(100);
      setCurrentAgentStep('Batch Analysis Complete!');
      setBatchResult(res);
    } catch (err) {
      console.error('Batch failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-400 border border-blue-500/30">
                HIGH SCALE CONCURRENCY (INDIA)
              </span>
              <span className="text-xs text-slate-400 font-mono">Parallel RocketRide Data Lanes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              High-Throughput Batch Processing
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Process 50 to 100+ accounts payable invoices concurrently across the 4-agent Sentinel security pipeline in under 2 seconds.
            </p>
          </div>

          <button
            disabled={processing}
            onClick={runBatch100Demo}
            className="w-full lg:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {processing ? <Cpu className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{processing ? 'Processing 100 Invoices...' : 'Execute 100-Invoice Batch Demo'}</span>
          </button>
        </div>

        {/* Live Progress Bar if processing */}
        {processing && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between text-xs font-mono gap-1">
              <span className="text-blue-400 font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin shrink-0" /> {currentAgentStep}
              </span>
              <span className="text-white font-extrabold">{progress}% Complete</span>
            </div>
            <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Batch Summary Stats in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Processed */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processed In Batch</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-mono">
                {batchResult ? batchResult.total_processed : '100'}
              </span>
              <span className="text-xs text-blue-400 font-bold font-mono">100 / 100</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">All parallel data lanes evaluated</p>
          </div>
        </div>

        {/* 🟢 Safe Count */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 🟢 Safe / Auto-Paid
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {batchResult ? batchResult.safe_count : '88'}
              </span>
              <span className="text-xs text-emerald-400 font-bold">88% Clean</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Auto-cleared for disbursement</p>
          </div>
        </div>

        {/* 🟡 Review Queue Count */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> 🟡 Review Queue
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-400 font-mono">
                {batchResult ? batchResult.review_count : '4'}
              </span>
              <span className="text-xs text-amber-400 font-bold">Pending Sign-off</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Amount baseline variance</p>
          </div>
        </div>

        {/* 🔴 High Risk / Fraud Count */}
        <div className="bg-gradient-to-br from-red-950/50 via-slate-900 to-slate-900 border border-red-500/40 rounded-2xl p-5 shadow-xl shadow-red-950/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> 🔴 Fraud Intercepted
            </span>
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-red-400 font-mono">
                {batchResult ? batchResult.fraud_hold_count : '8'}
              </span>
              <span className="text-[10px] text-red-300 font-bold bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
                PAYMENT HOLD
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 font-mono">
              Protected: <strong>₹{batchResult ? (batchResult.total_money_protected / 10000000).toFixed(2) + ' Cr' : '₹3.64 Cr'}</strong>
            </p>
          </div>
        </div>

      </div>

      {/* Drag and drop upload zone */}
      <div className="border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-950/70 rounded-3xl p-8 sm:p-12 text-center transition-all space-y-4">
        <UploadCloud className="w-14 h-14 text-slate-400 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-white">Upload Bulk Indian Invoices (ZIP / CSV / PDF Folder)</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Drop a batch of up to 500 accounts payable GST invoices. Sentinel orchestrates parallel LLM worker lanes to extract entities and detect fraud simultaneously.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={runBatch100Demo}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
          >
            Select Files or Run 100-Invoice Simulation
          </button>
        </div>
      </div>

    </div>
  );
}
