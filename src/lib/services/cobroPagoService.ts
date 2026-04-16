import * as Local from "./cobroPagoLocalService";

type Cobro = any;
type Pago = any;

function hasWindow() {
  return typeof window !== "undefined";
}

async function apiFetch<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
    ...opts,
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  }

  return data as T;
}

function normalizeCobro(raw: any) {
  if (!raw) return null;

  return {
    ...raw,
    fechaEmision: raw?.fechaEmision ?? raw?.fecha_emision ?? null,
    fechaVencimiento: raw?.fechaVencimiento ?? raw?.fecha_vencimiento ?? null,
    createdAt: raw?.createdAt ?? raw?.created_at ?? null,
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? null,
    cliente: raw?.cliente ?? null,
  };
}

function normalizePago(raw: any) {
  if (!raw) return null;

  return {
    ...raw,
    cuentaCobroId: raw?.cuentaCobroId ?? raw?.cuenta_cobro_id ?? null,
    cobroId: raw?.cobroId ?? raw?.cobro_id ?? null,
    clienteId: raw?.clienteId ?? raw?.cliente_id ?? null,
    valor: Number(raw?.valor ?? raw?.monto ?? 0),
    createdAt: raw?.createdAt ?? raw?.created_at ?? null,
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? null,
  };
}

export async function listCobros(search = ""): Promise<Cobro[]> {
  if (!hasWindow()) return [];

  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    const data = await apiFetch<any>(`/api/cobros${q}`);

    let items: Cobro[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.items)) items = data.items;
    else if (Array.isArray(data?.list)) items = data.list;

    return items.map(normalizeCobro).filter(Boolean);
  } catch (error) {
    console.warn("[cobroPagoService] fallback listCobros:", error);

    const localItems =
      typeof (Local as any).listarCobros === "function"
        ? (Local as any).listarCobros(search)
        : [];

    return (Array.isArray(localItems) ? localItems : []).map(normalizeCobro).filter(Boolean);
  }
}

export async function getCobro(id: string): Promise<Cobro | null> {
  if (!hasWindow()) return null;

  try {
    const data = await apiFetch<any>(`/api/cobros/${encodeURIComponent(id)}`);
    if (!data) return null;
    if (data?.item) return normalizeCobro(data.item);
    return normalizeCobro(data);
  } catch (error) {
    console.warn("[cobroPagoService] fallback getCobro:", error);

    return typeof (Local as any).obtenerCobroPorId === "function"
      ? normalizeCobro((Local as any).obtenerCobroPorId(id))
      : null;
  }
}

export async function createCobro(data: any): Promise<Cobro> {
  if (!hasWindow()) throw new Error("createCobro solo en browser");

  try {
    const result = await apiFetch<any>("/api/cobros", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return normalizeCobro(result?.item ?? result);
  } catch (error) {
    console.warn("[cobroPagoService] fallback createCobro:", error);

    return typeof (Local as any).crearCobro === "function"
      ? normalizeCobro((Local as any).crearCobro(data))
      : data;
  }
}

export async function updateCobro(id: string, patch: any): Promise<Cobro> {
  if (!hasWindow()) throw new Error("updateCobro solo en browser");

  try {
    const result = await apiFetch<any>(`/api/cobros/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });

    return normalizeCobro(result?.item ?? result);
  } catch (error) {
    console.warn("[cobroPagoService] fallback updateCobro:", error);

    return typeof (Local as any).actualizarCobro === "function"
      ? normalizeCobro((Local as any).actualizarCobro(id, patch))
      : patch;
  }
}

export async function deleteCobro(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deleteCobro solo en browser");

  try {
    await apiFetch(`/api/cobros/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("[cobroPagoService] fallback deleteCobro:", error);

    if (typeof (Local as any).eliminarCobro === "function") {
      (Local as any).eliminarCobro(id);
    }
  }
}

export async function listPagos(): Promise<Pago[]> {
  if (!hasWindow()) return [];

  try {
    const data = await apiFetch<any>("/api/pagos");

    let items: Pago[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.items)) items = data.items;
    else if (Array.isArray(data?.list)) items = data.list;

    return items.map(normalizePago).filter(Boolean);
  } catch (error) {
    console.warn("[cobroPagoService] fallback listPagos:", error);

    const localItems =
      typeof (Local as any).listarPagos === "function"
        ? (Local as any).listarPagos()
        : [];

    return (Array.isArray(localItems) ? localItems : []).map(normalizePago).filter(Boolean);
  }
}

export async function createPago(data: any): Promise<Pago> {
  if (!hasWindow()) throw new Error("createPago solo en browser");

  try {
    const result = await apiFetch<any>("/api/pagos", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return normalizePago(result?.item ?? result);
  } catch (error) {
    console.warn("[cobroPagoService] fallback createPago:", error);

    return typeof (Local as any).crearPago === "function"
      ? normalizePago((Local as any).crearPago(data))
      : data;
  }
}

export function calcularSaldoCobro(cobro: any, pagos: any[]) {
  const total = Number(cobro?.total ?? 0);
  const abonado = (Array.isArray(pagos) ? pagos : [])
    .filter((p) => (p?.cuentaCobroId ?? p?.cobroId ?? "") === cobro?.id)
    .reduce((acc, p) => acc + Number(p?.valor ?? p?.monto ?? 0), 0);

  const saldo = Math.max(0, total - abonado);

  return {
    total,
    abonado,
    saldo,
    status:
      saldo <= 0
        ? "pagado"
        : abonado > 0
          ? "parcial"
          : (cobro?.status ?? "pendiente"),
  };
}

export const listCuentas = listCobros;
export const getCuenta = getCobro;
export const createCuenta = createCobro;
export const updateCuenta = updateCobro;
export const deleteCuenta = deleteCobro;

export const cobroPagoService = {
  listCobros,
  listCuentas,
  getCobro,
  getCuenta,
  createCobro,
  createCuenta,
  updateCobro,
  updateCuenta,
  deleteCobro,
  deleteCuenta,
  listPagos,
  createPago,
  calcularSaldoCobro,
};