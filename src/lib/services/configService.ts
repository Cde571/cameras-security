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
const API = "/api/config/empresa";

export type EmpresaConfig = {
  id?: string;
  nombre: string;
  nit: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  website: string;
  logoUrl: string;
  resolucion: string;
  prefijoCotizacion: string;
  prefijoOrden: string;
  prefijoActa: string;
  prefijoCobro: string;
  moneda: string;
  timezone: string;
};

function emptyEmpresa(): EmpresaConfig {
  return {
    nombre: "Omnivision",
    nit: "",
    email: "admin@empresa.com",
    telefono: "",
    direccion: "",
    ciudad: "",
    website: "",
    logoUrl: "",
    resolucion: "",
    prefijoCotizacion: "COT",
    prefijoOrden: "OT",
    prefijoActa: "ACT",
    prefijoCobro: "CC",
    moneda: "COP",
    timezone: "America/Bogota",
  };
}

function normalize(raw: any): EmpresaConfig {
  return {
    id: raw?.id ? String(raw.id) : undefined,
    nombre: String(raw?.nombre ?? "Omnivision"),
    nit: String(raw?.nit ?? ""),
    email: String(raw?.email ?? "admin@empresa.com"),
    telefono: String(raw?.telefono ?? ""),
    direccion: String(raw?.direccion ?? ""),
    ciudad: String(raw?.ciudad ?? ""),
    website: String(raw?.website ?? ""),
    logoUrl: String(raw?.logoUrl ?? ""),
    resolucion: String(raw?.resolucion ?? ""),
    prefijoCotizacion: String(raw?.prefijoCotizacion ?? "COT"),
    prefijoOrden: String(raw?.prefijoOrden ?? "OT"),
    prefijoActa: String(raw?.prefijoActa ?? "ACT"),
    prefijoCobro: String(raw?.prefijoCobro ?? "CC"),
    moneda: String(raw?.moneda ?? "COP"),
    timezone: String(raw?.timezone ?? "America/Bogota"),
  };
}

export async function getEmpresa(): Promise<EmpresaConfig> {
  if (!hasWindow()) return emptyEmpresa();
  const data = await apiFetch<any>(API);
  return normalize(data?.item ?? data);
}

export async function setEmpresa(payload: EmpresaConfig): Promise<EmpresaConfig> {
  if (!hasWindow()) throw new Error("setEmpresa solo en browser");
  const data = await apiFetch<any>(API, {
    method: "PATCH",
    json: payload,
  });
  return normalize(data?.item ?? data);
}

export async function saveEmpresa(payload: EmpresaConfig): Promise<EmpresaConfig> {
  return await setEmpresa(payload);
}