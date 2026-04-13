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

import * as Local from "./cobroPagoLocalService";
export type { Pago } from "./cobroPagoLocalService";

const API = "/api/pagos";

export async function listPagos(search = "") {
  if (!hasWindow()) return [] as any[];
  try {
    return await apiFetch<any[]>(${API}?q=);
  } catch {
    return Local.listPagos?.(search) ?? [];
  }
}

export async function createPago(data: any) {
  if (!hasWindow()) throw new Error("createPago solo en browser");
  try {
    return await apiFetch<any>(API, { method: "POST", json: data });
  } catch {
    return Local.createPago?.(data) ?? data;
  }
}

export async function deletePago(id: string) {
  if (!hasWindow()) throw new Error("deletePago solo en browser");
  try {
    await apiFetch(${API}/, { method: "DELETE" });
  } catch {
    Local.deletePago?.(id);
  }
}
