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

const hasWindow = () => typeof window !== "undefined";

export type ReporteDashboard = {
  kpis: {
    totalVentas: number;
    totalCobrado: number;
    carteraPendiente: number;
    clientes: number;
    productos: number;
    cotizaciones: number;
    ordenesAbiertas: number;
    actasFirmadas: number;
  };
  recientes: {
    cotizaciones: any[];
    cobros: any[];
    pagos: any[];
  };
};

export type ReporteVentaItem = {
  periodo: string;
  cantidad: number;
  total: number;
};

export type ReporteProductoItem = {
  name: string;
  count: number;
  total: number;
};

export type ReporteClienteItem = {
  name: string;
  count: number;
  total: number;
};

export type ReporteMargenItem = {
  category: string;
  revenue: number;
  cost: number;
  profit: number;
  marginPct: number;
};

export async function getReporteDashboard(): Promise<ReporteDashboard> {
  if (!hasWindow()) {
    return {
      kpis: {
        totalVentas: 0,
        totalCobrado: 0,
        carteraPendiente: 0,
        clientes: 0,
        productos: 0,
        cotizaciones: 0,
        ordenesAbiertas: 0,
        actasFirmadas: 0,
      },
      recientes: {
        cotizaciones: [],
        cobros: [],
        pagos: [],
      },
    };
  }

  return await apiFetch<ReporteDashboard>("/api/reportes/dashboard");
}

export async function getReporteVentas(): Promise<ReporteVentaItem[]> {
  if (!hasWindow()) return [];

  const data = await apiFetch<any>("/api/reportes/ventas");
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  return items.map((item: any) => ({
    periodo: String(item?.periodo ?? ""),
    cantidad: Number(item?.cantidad || 0),
    total: Number(item?.total || 0),
  }));
}

export async function getReporteProductos(): Promise<ReporteProductoItem[]> {
  if (!hasWindow()) return [];

  const data = await apiFetch<any>("/api/reportes/productos");
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  return items.map((item: any) => ({
    name: String(item?.name ?? "Producto"),
    count: Number(item?.count || 0),
    total: Number(item?.total || 0),
  }));
}

export async function getReporteClientes(): Promise<ReporteClienteItem[]> {
  if (!hasWindow()) return [];

  const data = await apiFetch<any>("/api/reportes/clientes");
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  return items.map((item: any) => ({
    name: String(item?.name ?? "Cliente"),
    count: Number(item?.count || 0),
    total: Number(item?.total || 0),
  }));
}

export async function getReporteMargenes(): Promise<ReporteMargenItem[]> {
  if (!hasWindow()) return [];

  const data = await apiFetch<any>("/api/reportes/margenes");
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  return items.map((item: any) => ({
    category: String(item?.category ?? "Sin categoría"),
    revenue: Number(item?.revenue || 0),
    cost: Number(item?.cost || 0),
    profit: Number(item?.profit || 0),
    marginPct: Number(item?.marginPct || 0),
  }));
}