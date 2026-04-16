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
const API_EMPRESA = "/api/config/empresa";
const API_IMPUESTOS = "/api/config/impuestos";
const API_PLANTILLAS = "/api/config/plantillas";
const API_USUARIOS = "/api/config/usuarios";

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

export type Impuesto = {
  id?: string;
  nombre: string;
  descripcion?: string;
  porcentaje: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Plantilla = {
  id?: string;
  nombre: string;
  tipo: string;
  contenido: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Usuario = {
  id?: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
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

function normalizeEmpresa(raw: any): EmpresaConfig {
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

function normalizeImpuesto(raw: any): Impuesto {
  return {
    id: raw?.id ? String(raw.id) : undefined,
    nombre: String(raw?.nombre ?? "Impuesto"),
    descripcion: String(raw?.descripcion ?? ""),
    porcentaje: Number(raw?.porcentaje ?? 0),
    activo: Boolean(raw?.activo ?? true),
    createdAt: raw?.createdAt ? String(raw.createdAt) : "",
    updatedAt: raw?.updatedAt ? String(raw.updatedAt) : "",
  };
}

function normalizePlantilla(raw: any): Plantilla {
  return {
    id: raw?.id ? String(raw.id) : undefined,
    nombre: String(raw?.nombre ?? "Plantilla"),
    tipo: String(raw?.tipo ?? "general"),
    contenido: String(raw?.contenido ?? ""),
    activo: Boolean(raw?.activo ?? true),
    createdAt: raw?.createdAt ? String(raw.createdAt) : "",
    updatedAt: raw?.updatedAt ? String(raw.updatedAt) : "",
  };
}

function normalizeUsuario(raw: any): Usuario {
  return {
    id: raw?.id ? String(raw.id) : undefined,
    nombre: String(raw?.nombre ?? "Usuario"),
    email: String(raw?.email ?? ""),
    rol: String(raw?.rol ?? "asesor"),
    activo: Boolean(raw?.activo ?? true),
    createdAt: raw?.createdAt ? String(raw.createdAt) : "",
    updatedAt: raw?.updatedAt ? String(raw.updatedAt) : "",
  };
}

export async function getEmpresa(): Promise<EmpresaConfig> {
  if (!hasWindow()) return emptyEmpresa();
  const data = await apiFetch<any>(API_EMPRESA);
  return normalizeEmpresa(data?.item ?? data);
}

export async function setEmpresa(payload: EmpresaConfig): Promise<EmpresaConfig> {
  if (!hasWindow()) throw new Error("setEmpresa solo en browser");
  const data = await apiFetch<any>(API_EMPRESA, {
    method: "PATCH",
    json: payload,
  });
  return normalizeEmpresa(data?.item ?? data);
}

export async function saveEmpresa(payload: EmpresaConfig): Promise<EmpresaConfig> {
  return await setEmpresa(payload);
}

export async function listImpuestos(): Promise<Impuesto[]> {
  if (!hasWindow()) return [];
  const data = await apiFetch<any>(API_IMPUESTOS);
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return items.map(normalizeImpuesto);
}

export async function upsertImpuesto(payload: Partial<Impuesto>): Promise<Impuesto> {
  if (!hasWindow()) throw new Error("upsertImpuesto solo en browser");

  const data = await apiFetch<any>(API_IMPUESTOS, {
    method: "POST",
    json: {
      id: payload?.id,
      nombre: payload?.nombre ?? "Impuesto",
      descripcion: payload?.descripcion ?? "",
      porcentaje: Number(payload?.porcentaje ?? 0),
      activo: Boolean(payload?.activo ?? true),
    },
  });

  return normalizeImpuesto(data?.item ?? data);
}

export async function deleteImpuesto(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deleteImpuesto solo en browser");
  await apiFetch(API_IMPUESTOS, {
    method: "DELETE",
    json: { id },
  });
}

export async function listPlantillas(): Promise<Plantilla[]> {
  if (!hasWindow()) return [];
  const data = await apiFetch<any>(API_PLANTILLAS);
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return items.map(normalizePlantilla);
}

export async function upsertPlantilla(payload: Partial<Plantilla>): Promise<Plantilla> {
  if (!hasWindow()) throw new Error("upsertPlantilla solo en browser");

  const data = await apiFetch<any>(API_PLANTILLAS, {
    method: "POST",
    json: {
      id: payload?.id,
      nombre: payload?.nombre ?? "Plantilla",
      tipo: payload?.tipo ?? "general",
      contenido: payload?.contenido ?? "",
      activo: Boolean(payload?.activo ?? true),
    },
  });

  return normalizePlantilla(data?.item ?? data);
}

export async function deletePlantilla(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deletePlantilla solo en browser");
  await apiFetch(API_PLANTILLAS, {
    method: "DELETE",
    json: { id },
  });
}

export async function listUsuarios(): Promise<Usuario[]> {
  if (!hasWindow()) return [];
  const data = await apiFetch<any>(API_USUARIOS);
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return items.map(normalizeUsuario);
}

export async function upsertUsuario(payload: Partial<Usuario>): Promise<Usuario> {
  if (!hasWindow()) throw new Error("upsertUsuario solo en browser");

  const data = await apiFetch<any>(API_USUARIOS, {
    method: "POST",
    json: {
      id: payload?.id,
      nombre: payload?.nombre ?? "Usuario",
      email: payload?.email ?? "",
      rol: payload?.rol ?? "asesor",
      activo: Boolean(payload?.activo ?? true),
      password: payload?.password ?? "",
    },
  });

  return normalizeUsuario(data?.item ?? data);
}

export async function deleteUsuario(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deleteUsuario solo en browser");
  await apiFetch(API_USUARIOS, {
    method: "DELETE",
    json: { id },
  });
}

export async function exportBackupJSON(filename = "backup-config.json"): Promise<string> {
  if (!hasWindow()) {
    throw new Error("exportBackupJSON solo en browser");
  }

  const [empresaRes, numeracionRes, impuestos, plantillas, usuarios] = await Promise.all([
    apiFetch<any>("/api/config/empresa"),
    apiFetch<any>("/api/config/numeracion"),
    listImpuestos(),
    listPlantillas(),
    listUsuarios(),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    empresa: empresaRes?.item ?? empresaRes ?? null,
    numeracion: numeracionRes?.item ?? numeracionRes ?? null,
    impuestos,
    plantillas,
    usuarios,
  };

  const content = JSON.stringify(payload, null, 2);

  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  return content;
}

export async function restoreBackupJSON(fileOrContent: File | string): Promise<{ ok: true }> {
  if (!hasWindow()) {
    throw new Error("restoreBackupJSON solo en browser");
  }

  let raw = "";
  if (typeof fileOrContent === "string") raw = fileOrContent;
  else raw = await fileOrContent.text();

  let parsed: any = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("El archivo de backup no es un JSON válido.");
  }

  const empresa = parsed?.empresa ?? null;
  const numeracion = parsed?.numeracion ?? null;
  const impuestos = Array.isArray(parsed?.impuestos) ? parsed.impuestos : [];
  const plantillas = Array.isArray(parsed?.plantillas) ? parsed.plantillas : [];
  const usuarios = Array.isArray(parsed?.usuarios) ? parsed.usuarios : [];

  if (empresa) {
    await apiFetch("/api/config/empresa", {
      method: "PATCH",
      json: empresa,
    });
  }

  if (numeracion) {
    await apiFetch("/api/config/numeracion", {
      method: "PATCH",
      json: numeracion,
    });
  }

  for (const item of impuestos) {
    await upsertImpuesto(item);
  }

  for (const item of plantillas) {
    await upsertPlantilla(item);
  }

  for (const item of usuarios) {
    await upsertUsuario(item);
  }

  return { ok: true };
}