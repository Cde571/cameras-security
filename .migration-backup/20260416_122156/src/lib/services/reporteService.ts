/** API-first service with LocalService fallback. */
import * as ReportesLocal from "./reporteLocalService";
export type ReporteDashboard = ReportesLocal.ReporteDashboard;

type FetchOpts = RequestInit & { json?: any };

const API = "/api/reportes";
const hasWindow = () => typeof window !== "undefined";

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
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }

  return data as T;
}

const local = () => ReportesLocal.getReporteDashboard();

export async function getDashboardReport() {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<ReporteDashboard>(`${API}/dashboard`);
  } catch {
    return local();
  }
}

export async function getVentasReport(_range: { from: string; to: string }) {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(`${API}/ventas`);
  } catch {
    return local().ventasMensuales;
  }
}

export async function getProductosReport(_range: { from: string; to: string }) {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(`${API}/productos`);
  } catch {
    return local().topProductos;
  }
}

export async function getClientesReport(_range: { from: string; to: string }) {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(`${API}/clientes`);
  } catch {
    return local().topClientes;
  }
}

export async function getMargenesReport(_range: { from: string; to: string }) {
  if (!hasWindow()) return null;
  try {
    return await apiFetch<any>(`${API}/margenes`);
  } catch {
    return local().margenes;
  }
}
