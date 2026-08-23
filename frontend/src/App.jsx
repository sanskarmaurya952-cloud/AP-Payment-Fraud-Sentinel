import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/Dashboard/DashboardView';
import InvoiceDetailView from './components/InvoiceDetail/InvoiceDetailView';
import BatchView from './components/BatchProcessing/BatchView';
import VendorHubView from './components/VendorHub/VendorHubView';
import DemoView from './components/Demo/DemoView';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(1);

  const handleSelectInvoice = (id) => {
    setSelectedInvoiceId(id);
    setCurrentTab('detail');
  };

  const handleRunDemoFromDashboard = async (scenarioKey) => {
    try {
      const res = await api.runDemoScenario(scenarioKey);
      setSelectedInvoiceId(res.id);
      setCurrentTab('detail');
    } catch (err) {
      console.error('Demo trigger failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedInvoiceId={selectedInvoiceId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            onSelectInvoice={handleSelectInvoice}
            onNavigateTab={setCurrentTab}
            onRunDemo={handleRunDemoFromDashboard}
          />
        )}

        {currentTab === 'detail' && (
          <InvoiceDetailView
            invoiceId={selectedInvoiceId}
            onBack={() => setCurrentTab('dashboard')}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'batch' && (
          <BatchView
            onSelectInvoice={handleSelectInvoice}
          />
        )}

        {currentTab === 'vendors' && (
          <VendorHubView />
        )}

        {currentTab === 'demo' && (
          <DemoView
            onSelectInvoice={handleSelectInvoice}
            onNavigateTab={setCurrentTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-400 font-mono mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-slate-300">AP Payment Fraud Sentinel</span>
            <span>• Autonomous Multi-Agent Defense Engine</span>
          </div>
          <div className="text-slate-400">
            <span>RocketRide Data Lanes • Human-In-The-Loop Enforced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
