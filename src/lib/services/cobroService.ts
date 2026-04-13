// src/lib/services/cobroService.ts

/**
 * API-first service with LocalService fallback.
 * - Front works now (localStorage)
 * - Later: implement /src/pages/api/... and these services will auto-use DB
 */

import * as Local from "./cobroPagoLocalService";
export type { CuentaCobro, Pago } from "./cobroPagoLocalService";

type FetchOpts = RequestInit & { json?: any };

const API = "/api/cobros";

function hasWindow() {
  return typeof window !== "undefined";
}

async function apiFetch<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(opts.headers as any),
  };

  // solo setear Content-Type cuando enviamos JSON
  const isSendingJson = opts.json !== undefined;
  if (isSendingJson && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const init: RequestInit = {
    ...opts,
    headers,
    body: isSendingJson ? JSON.stringify(opts.json) : opts.body,
  };

  const res = await fetch(url, init);

  // si es 204, no hay body
  if (res.status === 204) return undefined as unknown as T;

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      data && (data.message || data.error)
        ? data.message || data.error
        : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export async function listCuentas(search = "") {
  if (!hasWindow()) return [] as any[];
  try {
    return await apiFetch<any[]>(
      `${API}?q=${encodeURIComponent(search)}`
    );
  } catch {
    return Local.listCuentas(search);
  }
}

export async function getCuenta(id: string) {
  if (!hasWindow()) return null as any;
  try {
    return await apiFetch<any>(`${API}/${encodeURIComponent(id)}`);
  } catch {
    return Local.getCuenta(id);
  }
}

export async function createCuenta(data: any) {
  if (!hasWindow()) throw new Error("createCuenta solo en browser");
  try {
    return await apiFetch<any>(API, { method: "POST", json: data });
  } catch {
    return Local.createCuenta(data);
  }
}

export async function updateCuenta(id: string, patch: any) {
  if (!hasWindow()) throw new Error("updateCuenta solo en browser");
  try {
    return await apiFetch<any>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: patch,
    });
  } catch {
    return Local.updateCuenta(id, patch);
  }
}

export async function deleteCuenta(id: string) {
  if (!hasWindow()) throw new Error("deleteCuenta solo en browser");
  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    Local.deleteCuenta(id);
  }
}
