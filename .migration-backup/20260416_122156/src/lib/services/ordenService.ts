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

import * as Local from "./ordenLocalService";
export type Orden = Local.Orden;

const API = "/api/ordenes";

export async function listOrdenes(search = "") {
  if (!hasWindow()) return [] as Local.Orden[];
  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    return await apiFetch<Local.Orden[]>(`${API}${q}`);
  } catch {
    return Local.listOrdenes(search);
  }
}

export async function getOrden(id: string) {
  if (!hasWindow()) return null as Local.Orden | null;
  try {
    return await apiFetch<Local.Orden>(`${API}/${encodeURIComponent(id)}`);
  } catch {
    return Local.getOrden(id);
  }
}

export async function createOrden(data: Omit<Local.Orden, "id" | "numero" | "createdAt" | "updatedAt">) {
  if (!hasWindow()) throw new Error("createOrden solo en browser");
  try {
    return await apiFetch<Local.Orden>(API, { method: "POST", json: data });
  } catch {
    return Local.createOrden(data as any);
  }
}

export async function updateOrden(id: string, patch: Partial<Local.Orden>) {
  if (!hasWindow()) throw new Error("updateOrden solo en browser");
  try {
    return await apiFetch<Local.Orden>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: patch,
    });
  } catch {
    return Local.updateOrden(id, patch as any);
  }
}

export async function deleteOrden(id: string) {
  if (!hasWindow()) throw new Error("deleteOrden solo en browser");
  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    Local.deleteOrden(id);
  }
}
