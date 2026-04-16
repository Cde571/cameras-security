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
const API = "/api/ordenes";

export type OrdenStatus = "pendiente" | "en_progreso" | "en_revision" | "finalizada" | "cancelada";

export type Tecnico = {
  id: string;
  nombre: string;
  telefono?: string;
  email?: string;
};

export type ClienteSnapshot = {
  id: string;
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type Evidencia = {
  id: string;
  createdAt: string;
  type: "foto" | "video" | "archivo" | "nota";
  titulo?: string;
  dataUrl?: string;
  nota?: string;
};

export type Orden = {
  id: string;
  numero: string;
  fechaCreacion: string;
  fechaProgramada?: string;
  status: OrdenStatus;
  clienteId: string;
  cliente: ClienteSnapshot;
  cotizacionId?: string;
  asunto?: string;
  direccionServicio?: string;
  observaciones?: string;
  tecnicoId?: string;
  tecnico?: Tecnico;
  checklistTemplateId?: string;
  checklist: ChecklistItem[];
  evidencias: Evidencia[];
  createdAt: string;
  updatedAt: string;
};

function normalizeOrden(raw: any): Orden {
  return {
    id: String(raw?.id ?? ""),
    numero: String(raw?.numero ?? ""),
    fechaCreacion: String(raw?.fechaCreacion ?? raw?.createdAt ?? raw?.created_at ?? ""),
    fechaProgramada: raw?.fechaProgramada ? String(raw.fechaProgramada) : undefined,
    status: String(raw?.status ?? "pendiente") as OrdenStatus,
    clienteId: String(raw?.clienteId ?? ""),
    cliente: {
      id: String(raw?.cliente?.id ?? raw?.clienteId ?? ""),
      nombre: String(raw?.cliente?.nombre ?? ""),
      documento: raw?.cliente?.documento ? String(raw.cliente.documento) : undefined,
      telefono: raw?.cliente?.telefono ? String(raw.cliente.telefono) : undefined,
      email: raw?.cliente?.email ? String(raw.cliente.email) : undefined,
      direccion: raw?.cliente?.direccion ? String(raw.cliente.direccion) : undefined,
      ciudad: raw?.cliente?.ciudad ? String(raw.cliente.ciudad) : undefined,
    },
    cotizacionId: raw?.cotizacionId ? String(raw.cotizacionId) : undefined,
    asunto: raw?.asunto ? String(raw.asunto) : undefined,
    direccionServicio: raw?.direccionServicio ? String(raw.direccionServicio) : undefined,
    observaciones: raw?.observaciones ? String(raw.observaciones) : undefined,
    tecnicoId: raw?.tecnicoId ? String(raw.tecnicoId) : undefined,
    tecnico: raw?.tecnico?.nombre
      ? { id: String(raw.tecnico?.id ?? raw.tecnicoId ?? ""), nombre: String(raw.tecnico.nombre) }
      : undefined,
    checklistTemplateId: raw?.checklistTemplateId ? String(raw.checklistTemplateId) : undefined,
    checklist: Array.isArray(raw?.checklist) ? raw.checklist : [],
    evidencias: Array.isArray(raw?.evidencias) ? raw.evidencias : [],
    createdAt: String(raw?.createdAt ?? ""),
    updatedAt: String(raw?.updatedAt ?? ""),
  };
}

export async function listOrdenes(search = "") {
  if (!hasWindow()) return [] as Orden[];
  const q = search ? `?q=${encodeURIComponent(search)}` : "";
  const rows = await apiFetch<any[]>(`${API}${q}`);
  return Array.isArray(rows) ? rows.map(normalizeOrden) : [];
}

export async function getOrden(id: string) {
  if (!hasWindow()) return null as Orden | null;
  const row = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`);
  return row ? normalizeOrden(row) : null;
}

export async function createOrden(data: any) {
  if (!hasWindow()) throw new Error("createOrden solo en browser");
  const row = await apiFetch<any>(API, { method: "POST", json: data });
  return normalizeOrden(row);
}

export async function updateOrden(id: string, patch: Partial<Orden>) {
  if (!hasWindow()) throw new Error("updateOrden solo en browser");
  const row = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    json: patch,
  });
  return normalizeOrden(row);
}

export async function deleteOrden(id: string) {
  if (!hasWindow()) throw new Error("deleteOrden solo en browser");
  await apiFetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
}