export * from "../services/cobroPagoService";

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
    throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  }

  return data as T;
}

function hasWindow() {
  return typeof window !== "undefined";
}

function toArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.list)) return data.list;
  return [];
}

function num(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function listarCobros(search = ""): Promise<any[]> {
  if (!hasWindow()) return [];
  const q = search ? `?q=${encodeURIComponent(search)}` : "";
  const data = await apiFetch<any>(`/api/cobros${q}`);
  return toArray(data);
}

export async function obtenerCobroPorId(id: string): Promise<any | null> {
  if (!hasWindow()) return null;
  if (!id) return null;
  const data = await apiFetch<any>(`/api/cobros/${encodeURIComponent(id)}`);
  return data?.item ?? data ?? null;
}

export async function crearCobro(payload: any): Promise<any> {
  if (!hasWindow()) throw new Error("crearCobro solo en browser");
  const data = await apiFetch<any>("/api/cobros", {
    method: "POST",
    json: payload,
  });
  return data?.item ?? data;
}

export async function actualizarCobro(id: string, payload: any): Promise<any> {
  if (!hasWindow()) throw new Error("actualizarCobro solo en browser");
  const data = await apiFetch<any>(`/api/cobros/${encodeURIComponent(id)}`, {
    method: "PATCH",
    json: payload,
  });
  return data?.item ?? data;
}

export async function eliminarCobro(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("eliminarCobro solo en browser");
  await apiFetch(`/api/cobros/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function listarPagos(search = ""): Promise<any[]> {
  if (!hasWindow()) return [];
  const q = search ? `?q=${encodeURIComponent(search)}` : "";
  const data = await apiFetch<any>(`/api/pagos${q}`);
  return toArray(data);
}

export async function crearPago(payload: any): Promise<any> {
  if (!hasWindow()) throw new Error("crearPago solo en browser");
  const data = await apiFetch<any>("/api/pagos", {
    method: "POST",
    json: payload,
  });
  return data?.item ?? data;
}

export async function getEstadoCuenta(clienteId: string): Promise<any> {
  if (!hasWindow()) {
    return {
      clienteId,
      cliente: null,
      cobros: [],
      pagos: [],
      resumen: {
        totalFacturado: 0,
        totalPagado: 0,
        saldoPendiente: 0,
        totalDocumentos: 0,
      },
    };
  }

  const id = String(clienteId ?? "").trim();
  if (!id) {
    return {
      clienteId: "",
      cliente: null,
      cobros: [],
      pagos: [],
      resumen: {
        totalFacturado: 0,
        totalPagado: 0,
        saldoPendiente: 0,
        totalDocumentos: 0,
      },
    };
  }

  const [clienteRes, carteraRes, pagosRes] = await Promise.all([
    apiFetch<any>(`/api/clientes/${encodeURIComponent(id)}`).catch(() => null),
    apiFetch<any>("/api/pagos/cartera").catch(() => ({ items: [] })),
    apiFetch<any>("/api/pagos").catch(() => ({ items: [] })),
  ]);

  const cliente = clienteRes?.item ?? clienteRes ?? null;

  const cartera = toArray(carteraRes).filter((item: any) => {
    return String(item?.clienteId ?? item?.cliente_id ?? item?.cliente?.id ?? "") === id;
  });

  const pagos = toArray(pagosRes).filter((item: any) => {
    return String(item?.clienteId ?? item?.cliente_id ?? item?.cliente?.id ?? "") === id;
  });

  const totalFacturado = cartera.reduce((acc: number, item: any) => acc + num(item?.total), 0);
  const totalPagado = pagos.reduce((acc: number, item: any) => acc + num(item?.valor), 0);
  const saldoPendiente = cartera.reduce((acc: number, item: any) => acc + num(item?.saldo), 0);

  return {
    clienteId: id,
    cliente,
    cobros: cartera,
    pagos,
    resumen: {
      totalFacturado,
      totalPagado,
      saldoPendiente,
      totalDocumentos: cartera.length,
    },
  };
}

export async function obtenerEstadoCuenta(clienteId: string): Promise<any> {
  return await getEstadoCuenta(clienteId);
}