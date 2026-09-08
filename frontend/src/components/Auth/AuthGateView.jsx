import React, { useState } from 'react';
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
  Info,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';

function ClerkButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
      <SignInButton mode="modal">
        <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer">
          <KeyRound className="w-4 h-4" /> Sign In with Clerk
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer">
          Create Reviewer Account
        </button>
      </SignUpButton>
    </div>
  );
}

export default function AuthGateView({ onAuthenticate, isClerkConfigured, onSaveCustomClerkKey }) {
  const [selectedRole, setSelectedRole] = useState('Chief Compliance Officer (India)');
  const [customKey, setCustomKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-8">
      
      {/* Background ambient glow */}
      <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -top-10"></div>
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -bottom-10"></div>

      <div className="relative z-10 w-full max-w-4xl space-y-8">
        
        {/* Main Auth Gate Card */}
        <div className="rounded-3xl bg-slate-900/85 border border-slate-800/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6 relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-red-500/15 text-red-400 border border-red-500/30 mx-auto">
            <Lock className="w-3.5 h-3.5 text-red-400" /> SECURE AP DEFENSE GATEWAY
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              AP Payment <span className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 bg-clip-text text-transparent">Fraud Sentinel</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Restricted Enterprise Access: Autonomous AI Accounts-Payable defense system protecting corporate treasury against unauthorized bank mutations, BEC, and fraudulent invoices.
            </p>
          </div>

          {/* Role selection box */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Authorized Reviewer Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
            >
              <option value="Chief Compliance Officer (India)">Chief Compliance Officer (India)</option>
              <option value="Accounts Payable Lead (Enterprise)">Accounts Payable Lead (Enterprise)</option>
              <option value="Corporate Treasury Director">Corporate Treasury Director</option>
              <option value="Internal Cyber Auditor">Internal Cyber Auditor</option>
            </select>
          </div>

          {/* Primary Authentication Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {isClerkConfigured ? (
              <ClerkButtons />
            ) : (
              <button 
                onClick={() => onAuthenticate(selectedRole)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <UserCheck className="w-5 h-5" /> Sign In as {selectedRole.split(' ')[0]}
              </button>
            )}
          </div>

          {/* Connect Clerk Option */}
          <div className="pt-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono underline cursor-pointer"
            >
              {showKeyInput ? 'Hide Clerk Setup' : '⚙️ Have a Clerk Publishable Key? Connect here'}
            </button>
          </div>

          {showKeyInput && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 text-left text-xs font-mono space-y-3 max-w-lg mx-auto animate-fade-in">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <KeyRound className="w-4 h-4 text-cyan-400" /> Enter Clerk Publishable Key:
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxx"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  onClick={() => onSaveCustomClerkKey(customKey)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-all whitespace-nowrap"
                >
                  Save &amp; Reload
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Key is saved to local session and instantly enables Clerk modal login.
              </p>
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
              Automated multi-agent inspection of GSTIN, IFSC routing, vendor baselines, and BEC fraud markers.
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
