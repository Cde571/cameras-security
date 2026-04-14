/** API-first service with LocalService fallback. */
import * as Local from "./cobroPagoLocalService";
export type CuentaCobro = Local.CuentaCobro;
export type Pago = Local.Pago;

type FetchOpts = RequestInit & { json?: any };

const API = "/api/cobros";
const hasWindow = () => typeof window !== "undefined";

async function apiFetch<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(opts.headers as any),
  };

  if (opts.json !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const init: RequestInit = {
    ...opts,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  };

  const res = await fetch(url, init);
  if (res.status === 204) return undefined as unknown as T;

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }

  return data as T;
}

export async function listCuentas(search = "") {
  if (!hasWindow()) return [] as Local.CuentaCobro[];
  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    return await apiFetch<Local.CuentaCobro[]>(`${API}${q}`);
  } catch {
    return Local.listCobros(search);
  }
}

export async function getCuenta(id: string) {
  if (!hasWindow()) return null as Local.CuentaCobro | null;
  try {
    return await apiFetch<Local.CuentaCobro>(`${API}/${encodeURIComponent(id)}`);
  } catch {
    return Local.getCobro(id);
  }
}

export async function createCuenta(data: Omit<Local.CuentaCobro, "id" | "numero" | "createdAt" | "updatedAt" | "subtotal" | "iva" | "total">) {
  if (!hasWindow()) throw new Error("createCuenta solo en browser");
  try {
    return await apiFetch<Local.CuentaCobro>(API, { method: "POST", json: data });
  } catch {
    return Local.createCobro(data as any);
  }
}

export async function updateCuenta(id: string, patch: Partial<Local.CuentaCobro>) {
  if (!hasWindow()) throw new Error("updateCuenta solo en browser");
  try {
    return await apiFetch<Local.CuentaCobro>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: patch,
    });
  } catch {
    return Local.updateCobro(id, patch as any);
  }
}

export async function deleteCuenta(id: string) {
  if (!hasWindow()) throw new Error("deleteCuenta solo en browser");
  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    Local.deleteCobro(id);
  }
}
