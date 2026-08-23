const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api/v1';

export const api = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // Invoices
  listInvoices: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/invoices?${query}`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  },

  getInvoiceDetail: async (id) => {
    const res = await fetch(`${API_BASE}/invoices/${id}`);
    if (!res.ok) throw new Error('Failed to fetch invoice details');
    return res.json();
  },

  analyzeInvoice: async (payload) => {
    const res = await fetch(`${API_BASE}/invoices/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to analyze invoice');
    return res.json();
  },

  reviewInvoice: async (id, payload) => {
    const res = await fetch(`${API_BASE}/invoices/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  // Batch Processing
  processBatch: async (payload) => {
    const res = await fetch(`${API_BASE}/batch/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to process batch');
    return res.json();
  },

  getBatchSummary: async (batchId) => {
    const res = await fetch(`${API_BASE}/batch/${batchId}`);
    if (!res.ok) throw new Error('Failed to fetch batch summary');
    return res.json();
  },

  // Vendors
  listVendors: async () => {
    const res = await fetch(`${API_BASE}/vendors`);
    if (!res.ok) throw new Error('Failed to fetch vendors');
    return res.json();
  },

  getVendorProfile: async (id) => {
    const res = await fetch(`${API_BASE}/vendors/${id}`);
    if (!res.ok) throw new Error('Failed to fetch vendor profile');
    return res.json();
  },

  // Demo Scenarios
  runDemoScenario: async (scenarioKey) => {
    const res = await fetch(`${API_BASE}/demo/run-scenario/${scenarioKey}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to trigger scenario');
    return res.json();
  },

  seedBatchDemo: async () => {
    const res = await fetch(`${API_BASE}/demo/seed-batch-demo`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to trigger 100-batch demo');
    return res.json();
  }
};
