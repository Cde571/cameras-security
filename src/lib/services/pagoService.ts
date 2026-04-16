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
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }

  return data as T;
}

const hasWindow = () => typeof window !== "undefined";

export type Pago = {
  id: string;
  cuentaCobroId?: string | null;
  clienteId?: string | null;
  fecha: string;
  metodo: string;
  referencia?: string | null;
  valor: number;
  notas?: string | null;
  cliente?: any;
  cuenta?: any;
};

export type CarteraItem = {
  id: string;
  numero: string;
  clienteId: string;
  cliente?: any;
  fechaEmision?: string;
  fechaVencimiento?: string | null;
  status: string;
  total: number;
  pagado: number;
  saldo: number;
};

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizePago(raw: any): Pago {
  return {
    id: String(raw?.id ?? ""),
    cuentaCobroId: raw?.cuentaCobroId ? String(raw.cuentaCobroId) : null,
    clienteId: raw?.clienteId ? String(raw.clienteId) : null,
    fecha: String(raw?.fecha ?? ""),
    metodo: String(raw?.metodo ?? "transferencia"),
    referencia: raw?.referencia ? String(raw.referencia) : "",
    valor: num(raw?.valor),
    notas: raw?.notas ? String(raw.notas) : "",
    cliente: raw?.cliente ?? null,
    cuenta: raw?.cuenta ?? null,
  };
}

function normalizeCartera(raw: any): CarteraItem {
  return {
    id: String(raw?.id ?? ""),
    numero: String(raw?.numero ?? ""),
    clienteId: String(raw?.clienteId ?? ""),
    cliente: raw?.cliente ?? null,
    fechaEmision: raw?.fechaEmision ? String(raw.fechaEmision) : "",
    fechaVencimiento: raw?.fechaVencimiento ? String(raw.fechaVencimiento) : "",
    status: String(raw?.status ?? "pendiente"),
    total: num(raw?.total),
    pagado: num(raw?.pagado),
    saldo: num(raw?.saldo),
  };
}

export async function listPagos(search = "") {
  if (!hasWindow()) return [] as Pago[];
  const q = search ? `?q=${encodeURIComponent(search)}` : "";
  const data = await apiFetch<any>(`/api/pagos${q}`);

  let items: any[] = [];
  if (Array.isArray(data)) items = data;
  else if (Array.isArray(data?.items)) items = data.items;

  return items.map(normalizePago);
}

export async function createPago(payload: any) {
  if (!hasWindow()) throw new Error("createPago solo en browser");
  const data = await apiFetch<any>("/api/pagos", { method: "POST", json: payload });
  return normalizePago(data?.item ?? data);
}

export async function getCartera() {
  if (!hasWindow()) return [] as CarteraItem[];
  const data = await apiFetch<any>("/api/pagos/cartera");

  let items: any[] = [];
  if (Array.isArray(data)) items = data;
  else if (Array.isArray(data?.items)) items = data.items;

  return items.map(normalizeCartera);
}

export const listPayments = listPagos;
export const createPayment = createPago;