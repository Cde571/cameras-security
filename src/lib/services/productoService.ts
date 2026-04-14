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

import * as Local from "./productoLocalService";
export type Producto = Local.Producto;
export type ProductoMeta = Local.ProductoMeta;
export type Kit = Local.Kit;

const API = "/api/productos";

export async function listProductos(search = "") {
  if (!hasWindow()) return [] as Local.Producto[];
  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    return await apiFetch<Local.Producto[]>(`${API}${q}`);
  } catch {
    return Local.listProductos(search);
  }
}

export async function getProducto(id: string) {
  if (!hasWindow()) return null as Local.Producto | null;
  try {
    return await apiFetch<Local.Producto>(`${API}/${encodeURIComponent(id)}`);
  } catch {
    return Local.getProducto(id);
  }
}

export async function createProducto(data: Omit<Local.Producto, "id" | "createdAt" | "updatedAt">) {
  if (!hasWindow()) throw new Error("createProducto solo en browser");
  try {
    return await apiFetch<Local.Producto>(API, { method: "POST", json: data });
  } catch {
    return Local.createProducto(data as any);
  }
}

export async function updateProducto(id: string, patch: Partial<Local.Producto>) {
  if (!hasWindow()) throw new Error("updateProducto solo en browser");
  try {
    return await apiFetch<Local.Producto>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: patch,
    });
  } catch {
    return Local.updateProducto(id, patch as any);
  }
}

export async function deleteProducto(id: string) {
  if (!hasWindow()) throw new Error("deleteProducto solo en browser");
  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    Local.deleteProducto(id);
  }
}
