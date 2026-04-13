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

import * as Local from "./actaLocalService";
export type { Acta } from "./actaLocalService";

const API = "/api/actas";

export async function listActas(search = "") {
  if (!hasWindow()) return [] as Local.Acta[];
  try {
    return await apiFetch<Local.Acta[]>(${API}?q=);
  } catch {
    return Local.listActas(search);
  }
}

export async function getActa(id: string) {
  if (!hasWindow()) return null as Local.Acta | null;
  try {
    return await apiFetch<Local.Acta>(${API}/);
  } catch {
    return Local.getActa(id);
  }
}

export async function createActa(data: Omit<Local.Acta, "id" | "createdAt" | "updatedAt">) {
  if (!hasWindow()) throw new Error("createActa solo en browser");
  try {
    return await apiFetch<Local.Acta>(API, { method: "POST", json: data });
  } catch {
    return Local.createActa(data as any);
  }
}

export async function updateActa(id: string, patch: Partial<Local.Acta>) {
  if (!hasWindow()) throw new Error("updateActa solo en browser");
  try {
    return await apiFetch<Local.Acta>(${API}/, { method: "PATCH", json: patch });
  } catch {
    return Local.updateActa(id, patch as any);
  }
}

export async function deleteActa(id: string) {
  if (!hasWindow()) throw new Error("deleteActa solo en browser");
  try {
    await apiFetch(${API}/, { method: "DELETE" });
  } catch {
    Local.deleteActa(id);
  }
}
