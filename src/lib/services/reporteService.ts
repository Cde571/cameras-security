/**
 * API-first service with LocalService fallback.
 * - Front works now (localStorage)
 * - Later: implement /src/pages/api/... and these services will auto-use DB
 */
type FetchOpts = RequestInit & { json?: any };

async function apiFetch<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as any),
  };

  const init: RequestInit = {
    ...opts,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  };

  const res = await fetch(url, init);
  const text = await res.text();

  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) ? (data.message || data.error) : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

function hasWindow() {
  return typeof window !== "undefined";
}

import * as ReportesLocal from "./reporteLocalService";

const API = "/api/reportes";

export async function getDashboardReport() {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(${API}/dashboard);
  } catch {
    return ReportesLocal.getDashboardReport?.() ?? null;
  }
}

export async function getVentasReport(range: { from: string; to: string }) {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(${API}/ventas?from=&to=);
  } catch {
    return ReportesLocal.getVentasReport?.(range) ?? null;
  }
}

export async function getProductosReport(range: { from: string; to: string }) {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(${API}/productos?from=&to=);
  } catch {
    return ReportesLocal.getProductosReport?.(range) ?? null;
  }
}

export async function getClientesReport(range: { from: string; to: string }) {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(${API}/clientes?from=&to=);
  } catch {
    return ReportesLocal.getClientesReport?.(range) ?? null;
  }
}

export async function getMargenesReport(range: { from: string; to: string }) {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(${API}/margenes?from=&to=);
  } catch {
    return ReportesLocal.getMargenesReport?.(range) ?? null;
  }
}
