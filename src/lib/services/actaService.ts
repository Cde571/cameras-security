/** API-first service with LocalService fallback. */
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
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }

  return data as T;
}

const hasWindow = () => typeof window !== "undefined";

import * as Local from "./actaLocalService";
export type Acta = Local.ActaEntrega;
export type ActaEntrega = Local.ActaEntrega;

const API = "/api/actas";

export async function listActas(search = "") {
  if (!hasWindow()) return [] as Local.ActaEntrega[];
  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    return await apiFetch<Local.ActaEntrega[]>(`${API}${q}`);
  } catch {
    return Local.listActas(search);
  }
}

export async function getActa(id: string) {
  if (!hasWindow()) return null as Local.ActaEntrega | null;
  try {
    return await apiFetch<Local.ActaEntrega>(`${API}/${encodeURIComponent(id)}`);
  } catch {
    return Local.getActa(id);
  }
}

export async function createActa(data: Omit<Local.ActaEntrega, "id" | "numero" | "createdAt" | "updatedAt">) {
  if (!hasWindow()) throw new Error("createActa solo en browser");
  try {
    return await apiFetch<Local.ActaEntrega>(API, { method: "POST", json: data });
  } catch {
    return Local.createActa(data as any);
  }
}

export async function updateActa(id: string, patch: Partial<Local.ActaEntrega>) {
  if (!hasWindow()) throw new Error("updateActa solo en browser");
  try {
    return await apiFetch<Local.ActaEntrega>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: patch,
    });
  } catch {
    return Local.updateActa(id, patch as any);
  }
}

export async function deleteActa(id: string) {
  if (!hasWindow()) throw new Error("deleteActa solo en browser");
  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    Local.deleteActa(id);
  }
}
