/**
 * JanVikas AI - API Client Service
 * Connects frontend views directly to FastAPI backend on http://127.0.0.1:8000
 */

const API_BASE = import.meta.env.VITE_BACKEND_API_URL || '/api';

export interface BackendHealthResponse {
  system: string;
  status: string;
  dpg_certification: string;
  bhashini_languages_active: number;
  gati_shakti_sync: string;
  dpdp_privacy: string;
}

export interface VoiceIngestPayload {
  audio_base64?: string;
  language: string;
  raw_text?: string;
  state: string;
  district: string;
  block: string;
}

export interface OptimizationPayload {
  total_budget_cr: number;
  strategy: string;
  target_state?: string;
}

export interface CopilotQueryPayload {
  query: string;
  role: string;
}

// 1. Check Backend Health
export async function checkBackendHealth(): Promise<{ online: boolean; data?: BackendHealthResponse }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      return { online: true, data };
    }
  } catch {
    // Backend offline
  }

  return { online: false };
}

// 2. Multilingual Voice Ingestion
export async function ingestVoiceApi(payload: VoiceIngestPayload) {
  try {
    const res = await fetch(`${API_BASE}/ingest/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local fallback:', err);
  }
  return null;
}

// 3. Knapsack Budget Optimization
export async function optimizeBudgetApi(payload: OptimizationPayload) {
  try {
    const res = await fetch(`${API_BASE}/budget/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local fallback:', err);
  }
  return null;
}

// 4. Copilot Query
export async function queryCopilotApi(payload: CopilotQueryPayload) {
  try {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local fallback:', err);
  }
  return null;
}
