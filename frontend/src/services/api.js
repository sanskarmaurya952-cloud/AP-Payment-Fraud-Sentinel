// Bulletproof API Base URL resolver
const getApiBase = () => {
  const rawUrl = import.meta.env.VITE_API_URL || '';
  if (!rawUrl || rawUrl.trim() === '') {
    return '/api/v1';
  }
  const clean = rawUrl.trim().replace(/\/+$/, '').replace(/\/api\/v1$/, '');
  return `${clean}/api/v1`;
};

const API_BASE = getApiBase();
console.log('[Sentinel] Connected to API Backend:', API_BASE);

export const api = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error(`Dashboard fetch failed (${res.status})`);
    return res.json();
  },

  // Invoices
  listInvoices: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/invoices?${query}`);
    if (!res.ok) throw new Error(`Invoice list fetch failed (${res.status})`);
    return res.json();
  },

  getInvoiceDetail: async (id) => {
    const res = await fetch(`${API_BASE}/invoices/${id}`);
    if (!res.ok) throw new Error(`Invoice detail fetch failed (${res.status})`);
    return res.json();
  },

  analyzeInvoice: async (payload) => {
    const res = await fetch(`${API_BASE}/invoices/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Invoice analyze failed (${res.status})`);
    return res.json();
  },

  reviewInvoice: async (id, payload) => {
    const res = await fetch(`${API_BASE}/invoices/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Invoice review failed (${res.status})`);
    return res.json();
  },

  // Batch Processing
  processBatch: async (payload) => {
    const res = await fetch(`${API_BASE}/batch/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Batch process failed (${res.status})`);
    return res.json();
  },

  getBatchSummary: async (batchId) => {
    const res = await fetch(`${API_BASE}/batch/${batchId}`);
    if (!res.ok) throw new Error(`Batch summary fetch failed (${res.status})`);
    return res.json();
  },

  // Vendors
  listVendors: async () => {
    const res = await fetch(`${API_BASE}/vendors`);
    if (!res.ok) throw new Error(`Vendor list fetch failed (${res.status})`);
    return res.json();
  },

  getVendorProfile: async (id) => {
    const res = await fetch(`${API_BASE}/vendors/${id}`);
    if (!res.ok) throw new Error(`Vendor profile fetch failed (${res.status})`);
    return res.json();
  },

  // Demo Scenarios
  runDemoScenario: async (scenarioKey) => {
    const res = await fetch(`${API_BASE}/demo/run-scenario/${scenarioKey}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Demo scenario failed (${res.status})`);
    return res.json();
  },

  seedBatchDemo: async () => {
    const res = await fetch(`${API_BASE}/demo/seed-batch-demo`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Batch demo failed (${res.status})`);
    return res.json();
  }
};
