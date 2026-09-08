import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  FileSearch, 
  Layers, 
  Building2, 
  Zap,
  Lock,
  UserCheck,
  LogOut
} from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';

function ClerkAuthControls() {
  return (
    <>
      <SignedIn>
        <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l sm:border-slate-800">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Finance Officer
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Authenticated</span>
          </div>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-9 h-9 ring-2 ring-red-500/30 hover:ring-red-500 transition-all'
              }
            }}
          />
        </div>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs tracking-wide shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <Lock className="w-3.5 h-3.5" /> Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  selectedInvoiceId, 
  isClerkConfigured, 
  isAuthenticated, 
  currentUserRole, 
  onSignOut,
  onOpenAuthGate
}) {
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
            onClick={() => isAuthenticated && setCurrentTab('dashboard')}
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

          {/* Navigation Links (Visible when authenticated) */}
          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
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
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="hidden xl:inline-block text-[10px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <Lock className="w-3.5 h-3.5 text-red-400" /> Authentication Required
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {isClerkConfigured ? (
              <ClerkAuthControls />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l sm:border-slate-800">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {currentUserRole.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Verified Session</span>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 transition-all cursor-pointer"
                  title="Lock Portal / Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthGate}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs tracking-wide shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" /> Sign In
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Links Bar */}
        {isAuthenticated && (
          <div className="lg:hidden flex items-center space-x-1 overflow-x-auto pb-3 pt-1 border-t border-slate-900">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
}
