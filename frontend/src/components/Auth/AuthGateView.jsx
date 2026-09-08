import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Cpu, 
  Building2, 
  Layers, 
  ArrowRight,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

export default function AuthGateView({ onDemoBypass, isClerkConfigured }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-10">
      
      {/* Background ambient glow */}
      <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -top-10"></div>
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -bottom-10"></div>

      <div className="relative z-10 w-full max-w-4xl space-y-8">
        
        {/* Main Card */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6 relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-red-500/15 text-red-400 border border-red-500/30 mx-auto">
            <Lock className="w-3.5 h-3.5 text-red-400" /> SECURE FINANCE PORTAL ACCESS
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              AP Payment <span className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 bg-clip-text text-transparent">Fraud Sentinel</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Enterprise accounts-payable defense system intercepting unauthorized bank account/IFSC mutations, Business Email Compromise (BEC), and invoice tampering in real time.
            </p>
          </div>

          {/* Auth Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isClerkConfigured ? (
              <>
                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                    <KeyRound className="w-4 h-4" /> Sign In to Defense Portal
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer">
                    Create Reviewer Account
                  </button>
                </SignUpButton>
              </>
            ) : (
              <button 
                onClick={onDemoBypass}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" /> Open Portal in Sandbox Demo Mode
              </button>
            )}
          </div>

          {/* Key Configuration Notice if needed */}
          {!isClerkConfigured && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-left text-xs font-mono space-y-2 max-w-xl mx-auto">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Info className="w-4 h-4 shrink-0" /> Clerk Key Setup Guide:
              </div>
              <p className="text-slate-300 leading-relaxed">
                Add your Clerk Publishable Key in <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300">frontend/.env.local</code>:
              </p>
              <div className="p-2.5 bg-slate-950 rounded-xl text-[11px] text-emerald-400 select-all overflow-x-auto">
                VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
              </div>
              <div className="text-[11px] text-slate-400">
                Get your key for free at <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">dashboard.clerk.com</a>
              </div>
            </div>
          )}

        </div>

        {/* 3 Core Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
              🤖
            </div>
            <h4 className="text-sm font-bold text-white">4 AI Specialist Agents</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sequential multi-agent inspection of GSTIN, IFSC routing, vendor baselines, and BEC fraud markers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h4 className="text-sm font-bold text-white">100x Concurrency</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Parallel RocketRide data lanes processing bulk batches of enterprise invoices in under 2 seconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              🧠
            </div>
            <h4 className="text-sm font-bold text-white">Adaptive Memory</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically recalibrates vendor variance thresholds based on Finance Officer approval feedback.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
