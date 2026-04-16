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
const API = "/api/config/numeracion";

export type NumeracionConfig = {
  id?: string;
  prefijoCotizacion: string;
  siguienteCotizacion: number;
  paddingCotizacion: number;
  prefijoOrden: string;
  siguienteOrden: number;
  paddingOrden: number;
  prefijoActa: string;
  siguienteActa: number;
  paddingActa: number;
  prefijoCobro: string;
  siguienteCobro: number;
  paddingCobro: number;
};

function emptyNumeracion(): NumeracionConfig {
  return {
    prefijoCotizacion: "COT",
    siguienteCotizacion: 1,
    paddingCotizacion: 4,
    prefijoOrden: "OT",
    siguienteOrden: 1,
    paddingOrden: 4,
    prefijoActa: "ACT",
    siguienteActa: 1,
    paddingActa: 4,
    prefijoCobro: "CC",
    siguienteCobro: 1,
    paddingCobro: 4,
  };
}

function normalize(raw: any): NumeracionConfig {
  return {
    id: raw?.id ? String(raw.id) : undefined,
    prefijoCotizacion: String(raw?.prefijoCotizacion ?? "COT"),
    siguienteCotizacion: Number(raw?.siguienteCotizacion ?? 1),
    paddingCotizacion: Number(raw?.paddingCotizacion ?? 4),
    prefijoOrden: String(raw?.prefijoOrden ?? "OT"),
    siguienteOrden: Number(raw?.siguienteOrden ?? 1),
    paddingOrden: Number(raw?.paddingOrden ?? 4),
    prefijoActa: String(raw?.prefijoActa ?? "ACT"),
    siguienteActa: Number(raw?.siguienteActa ?? 1),
    paddingActa: Number(raw?.paddingActa ?? 4),
    prefijoCobro: String(raw?.prefijoCobro ?? "CC"),
    siguienteCobro: Number(raw?.siguienteCobro ?? 1),
    paddingCobro: Number(raw?.paddingCobro ?? 4),
  };
}

export async function getNumeracion(): Promise<NumeracionConfig> {
  if (!hasWindow()) return emptyNumeracion();
  const data = await apiFetch<any>(API);
  return normalize(data?.item ?? data);
}

export async function setNumeracion(payload: NumeracionConfig): Promise<NumeracionConfig> {
  if (!hasWindow()) throw new Error("setNumeracion solo en browser");
  const data = await apiFetch<any>(API, {
    method: "PATCH",
    json: payload,
  });
  return normalize(data?.item ?? data);
}

export async function saveNumeracion(payload: NumeracionConfig): Promise<NumeracionConfig> {
  return await setNumeracion(payload);
}