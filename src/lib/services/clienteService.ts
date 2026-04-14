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

import * as Local from "./clienteLocalService";
export type Cliente = Local.Cliente;

const API = "/api/clientes";

export async function listClientes(search = "") {
  if (!hasWindow()) return [] as Local.Cliente[];
  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    return await apiFetch<Local.Cliente[]>(`${API}${q}`);
  } catch {
    return Local.listClientes(search);
  }
}

export async function getCliente(id: string) {
  if (!hasWindow()) return null as Local.Cliente | null;
  try {
    return await apiFetch<Local.Cliente>(`${API}/${encodeURIComponent(id)}`);
  } catch {
    return Local.getCliente(id);
  }
}

export async function createCliente(data: Omit<Local.Cliente, "id" | "createdAt" | "updatedAt">) {
  if (!hasWindow()) throw new Error("createCliente solo en browser");
  try {
    return await apiFetch<Local.Cliente>(API, { method: "POST", json: data });
  } catch {
    return Local.createCliente(data as any);
  }
}

export async function updateCliente(id: string, patch: Partial<Local.Cliente>) {
  if (!hasWindow()) throw new Error("updateCliente solo en browser");
  try {
    return await apiFetch<Local.Cliente>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: patch,
    });
  } catch {
    return Local.updateCliente(id, patch as any);
  }
}

export async function deleteCliente(id: string) {
  if (!hasWindow()) throw new Error("deleteCliente solo en browser");
  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    Local.deleteCliente(id);
  }
}
