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

export type DashboardSummary = {
  kpis: {
    cotizadoMes: number;
    cotizacionesPendientes: number;
    ordenesCurso: number;
    carteraPendiente: number;
    totalClientes: number;
  };
  recientes: Array<{
    id: string;
    tipo: string;
    numero: string;
    estado: string;
    total: number;
    fecha: string;
  }>;
  alertas: Array<{
    tipo: string;
    titulo: string;
    descripcion: string;
    fecha: string;
  }>;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (!hasWindow()) {
    return {
      kpis: {
        cotizadoMes: 0,
        cotizacionesPendientes: 0,
        ordenesCurso: 0,
        carteraPendiente: 0,
        totalClientes: 0,
      },
      recientes: [],
      alertas: [],
    };
  }

  return await apiFetch<DashboardSummary>("/api/dashboard/summary");
}