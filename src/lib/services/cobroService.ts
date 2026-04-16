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
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      data?.detail ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

const hasWindow = () => typeof window !== "undefined";
const API = "/api/cobros";

export type CuentaCobroItem = {
  id?: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
};

export type CuentaCobro = {
  id: string;
  numero: string;
  clienteId: string;
  cliente?: {
    id: string;
    nombre: string;
    documento?: string;
    telefono?: string;
    email?: string;
    ciudad?: string;
  } | null;
  fechaEmision: string;
  fechaVencimiento?: string | null;
  status: string;
  subtotal: number;
  iva: number;
  total: number;
  observaciones?: string | null;
  items: CuentaCobroItem[];
  createdAt?: string;
  updatedAt?: string;
};

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeCuenta(raw: any): CuentaCobro {
  return {
    id: String(raw?.id ?? ""),
    numero: String(raw?.numero ?? ""),
    clienteId: String(raw?.clienteId ?? ""),
    cliente: raw?.cliente
      ? {
          id: String(raw?.cliente?.id ?? raw?.clienteId ?? ""),
          nombre: String(raw?.cliente?.nombre ?? ""),
          documento: raw?.cliente?.documento ? String(raw.cliente.documento) : undefined,
          telefono: raw?.cliente?.telefono ? String(raw.cliente.telefono) : undefined,
          email: raw?.cliente?.email ? String(raw.cliente.email) : undefined,
          ciudad: raw?.cliente?.ciudad ? String(raw.cliente.ciudad) : undefined,
        }
      : null,
    fechaEmision: String(raw?.fechaEmision ?? ""),
    fechaVencimiento: raw?.fechaVencimiento ? String(raw.fechaVencimiento) : null,
    status: String(raw?.status ?? "pendiente"),
    subtotal: num(raw?.subtotal),
    iva: num(raw?.iva),
    total: num(raw?.total),
    observaciones: raw?.observaciones ? String(raw.observaciones) : "",
    items: Array.isArray(raw?.items)
      ? raw.items.map((item: any) => ({
          id: item?.id ? String(item.id) : undefined,
          descripcion: String(item?.descripcion ?? ""),
          cantidad: num(item?.cantidad || 1),
          valorUnitario: num(item?.valorUnitario || 0),
          subtotal: num(item?.subtotal || 0),
        }))
      : [],
    createdAt: raw?.createdAt ? String(raw.createdAt) : "",
    updatedAt: raw?.updatedAt ? String(raw.updatedAt) : "",
  };
}

export async function listCuentasCobro(search = "") {
  if (!hasWindow()) return [] as CuentaCobro[];
  const q = search ? `?q=${encodeURIComponent(search)}` : "";
  const data = await apiFetch<any>(`${API}${q}`);

  let items: any[] = [];
  if (Array.isArray(data)) items = data;
  else if (Array.isArray(data?.items)) items = data.items;

  return items.map(normalizeCuenta);
}

export async function getCuentaCobro(id: string) {
  if (!hasWindow()) return null as CuentaCobro | null;
  const data = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`);
  if (!data) return null;
  return normalizeCuenta(data?.item ?? data);
}

export async function createCuentaCobro(payload: any) {
  if (!hasWindow()) throw new Error("createCuentaCobro solo en browser");
  const data = await apiFetch<any>(API, { method: "POST", json: payload });
  return normalizeCuenta(data?.item ?? data);
}

export async function updateCuentaCobro(id: string, payload: any) {
  if (!hasWindow()) throw new Error("updateCuentaCobro solo en browser");
  const data = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    json: payload,
  });
  return normalizeCuenta(data?.item ?? data);
}

export async function deleteCuentaCobro(id: string) {
  if (!hasWindow()) throw new Error("deleteCuentaCobro solo en browser");
  await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export const listCobros = listCuentasCobro;
export const getCobro = getCuentaCobro;
export const createCobro = createCuentaCobro;
export const updateCobro = updateCuentaCobro;
export const deleteCobro = deleteCuentaCobro;