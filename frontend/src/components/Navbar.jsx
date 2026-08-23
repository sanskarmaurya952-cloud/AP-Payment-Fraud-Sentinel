import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FileSearch, 
  Layers, 
  Building2, 
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, selectedInvoiceId }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
    { id: 'detail', label: selectedInvoiceId ? `Evidence #${selectedInvoiceId}` : 'Evidence Inspector', shortLabel: 'Evidence', icon: FileSearch },
    { id: 'batch', label: 'Batch Processing', shortLabel: 'Batch Scale', icon: Layers, badge: '100x Scale' },
    { id: 'vendors', label: 'Vendor Intelligence', shortLabel: 'Vendors', icon: Building2 },
    { id: 'demo', label: 'Attack Simulator', shortLabel: 'Simulator', icon: Zap, highlight: true },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Status */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer select-none group"
            onClick={() => setCurrentTab('dashboard')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-red-400 transition-colors">
                  AP FRAUD SENTINEL
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  ACTIVE DEFENSE
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono tracking-normal leading-tight">
                AI Autonomous Payment Interceptor
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30 shadow-inner'
                      : item.highlight
                      ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-400' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.shortLabel}</span>
                  {item.badge && (
                    <span className="hidden xl:inline-block text-[10px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
}
