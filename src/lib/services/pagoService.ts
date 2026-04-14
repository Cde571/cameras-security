/** API-first service with LocalService fallback. */
import * as Local from "./cobroPagoLocalService";
export type Pago = Local.Pago;

type FetchOpts = RequestInit & { json?: any };

const API = "/api/pagos";
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

export async function listPagos(search = "") {
  if (!hasWindow()) return [] as Local.Pago[];
  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    return await apiFetch<Local.Pago[]>(`${API}${q}`);
  } catch {
    return Local.listPagos(search);
  }
}

export async function createPago(data: Omit<Local.Pago, "id" | "createdAt" | "updatedAt">) {
  if (!hasWindow()) throw new Error("createPago solo en browser");
  try {
    return await apiFetch<Local.Pago>(API, { method: "POST", json: data });
  } catch {
    return Local.createPago(data as any);
  }
}

export async function deletePago(id: string) {
  if (!hasWindow()) throw new Error("deletePago solo en browser");
  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    # Fallback local no implementa deletePago todavía
  }
}
