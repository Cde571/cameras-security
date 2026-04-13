export type OrdenStatus = "pendiente" | "en_progreso" | "en_revision" | "finalizada" | "cancelada";

export type Tecnico = {
  id: string;
  nombre: string;
  telefono?: string;
  email?: string;
};

export type Evidencia = {
  id: string;
  createdAt: string;
  type: "foto" | "video" | "archivo" | "nota";
  titulo?: string;
  dataUrl?: string; // front-first: guardamos base64 (ojo tamaño). Luego lo pasamos a S3/Cloudinary.
  nota?: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type ChecklistTemplate = {
  id: string;
  nombre: string;
  items: { label: string }[];
  createdAt: string;
  updatedAt: string;
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

export type Orden = {
  id: string;
  numero: string;           // OT-YYYY-####

  fechaCreacion: string;    // ISO date
  fechaProgramada?: string; // ISO date
  status: OrdenStatus;

  clienteId: string;
  cliente: ClienteSnapshot;

  cotizacionId?: string;    // enlace opcional
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

const KEY_ORD = "coti_ordenes_v1";
const KEY_TPL = "coti_checklists_tpl_v1";
const KEY_SEQ = "coti_ordenes_seq_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try { return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
}

function uid(prefix: string) {
  return (globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

function nextNumero(): string {
  if (typeof window === "undefined") return "OT-0000-0000";
  const year = new Date().getFullYear();
  const cur = safeParse<Record<string, number>>(localStorage.getItem(KEY_SEQ), {});
  const n = (cur[String(year)] ?? 0) + 1;
  cur[String(year)] = n;
  localStorage.setItem(KEY_SEQ, JSON.stringify(cur));
  const padded = String(n).padStart(4, "0");
  return `OT-${year}-${padded}`;
}

function seedChecklistsIfEmpty() {
  if (typeof window === "undefined") return;
  const tpls = safeParse<ChecklistTemplate[]>(localStorage.getItem(KEY_TPL), []);
  if (tpls.length > 0) return;

  const now = new Date().toISOString();
  const seed: ChecklistTemplate[] = [
    {
      id: uid("tpl"),
      nombre: "Instalación estándar CCTV",
      items: [
        { label: "Verificar puntos de instalación" },
        { label: "Tendido de cableado / canaleta" },
        { label: "Montaje de cámaras" },
        { label: "Conexión a NVR/DVR" },
        { label: "Configuración de red / acceso remoto" },
        { label: "Pruebas de grabación" },
        { label: "Capacitación básica al cliente" },
        { label: "Entrega de credenciales" },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid("tpl"),
      nombre: "Mantenimiento preventivo",
      items: [
        { label: "Limpieza de lentes/carcasa" },
        { label: "Revisión de conectores" },
        { label: "Prueba de grabación y playback" },
        { label: "Revisión de almacenamiento" },
        { label: "Verificar UPS/energía" },
        { label: "Reporte final al cliente" },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  localStorage.setItem(KEY_TPL, JSON.stringify(seed));
}

function seedOrdenesIfEmpty() {
  if (typeof window === "undefined") return;
  seedChecklistsIfEmpty();

  const list = safeParse<Orden[]>(localStorage.getItem(KEY_ORD), []);
  if (list.length > 0) return;

  const now = new Date().toISOString();
  const fecha = new Date().toISOString().slice(0, 10);

  const seed: Orden[] = [
    {
      id: uid("ord"),
      numero: nextNumero(),
      fechaCreacion: fecha,
      fechaProgramada: fecha,
      status: "en_progreso",
      clienteId: "seed",
      cliente: { id: "seed", nombre: "Clínica San Rafael", documento: "800555222-9", ciudad: "Bogotá" },
      asunto: "Instalación cámaras + acceso remoto",
      direccionServicio: "Av 80 # 20-10",
      observaciones: "Se requiere coordinación con seguridad.",
      tecnicoId: "tec1",
      tecnico: { id: "tec1", nombre: "Técnico 1", telefono: "3000000000" },
      checklistTemplateId: "",
      checklist: [
        { id: uid("chk"), label: "Verificar puntos de instalación", done: true },
        { id: uid("chk"), label: "Montaje de cámaras", done: false },
        { id: uid("chk"), label: "Configuración acceso remoto", done: false },
      ],
      evidencias: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  localStorage.setItem(KEY_ORD, JSON.stringify(seed));
}

/* =========================
   Ordenes CRUD
========================= */
export function listOrdenes(search = ""): Orden[] {
  if (typeof window === "undefined") return [];
  seedOrdenesIfEmpty();

  const list = safeParse<Orden[]>(localStorage.getItem(KEY_ORD), []);
  const q = search.trim().toLowerCase();

  return list
    .filter((o) => {
      if (!q) return true;
      const blob = [
        o.numero,
        o.cliente?.nombre,
        o.asunto,
        o.status,
        o.fechaCreacion,
        o.fechaProgramada,
        o.tecnico?.nombre,
      ].filter(Boolean).join(" ").toLowerCase();
      return blob.includes(q);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getOrden(id: string): Orden | null {
  if (typeof window === "undefined") return null;
  seedOrdenesIfEmpty();
  const list = safeParse<Orden[]>(localStorage.getItem(KEY_ORD), []);
  return list.find((o) => o.id === id) ?? null;
}

export function createOrden(data: Omit<Orden, "id" | "numero" | "createdAt" | "updatedAt">): Orden {
  if (typeof window === "undefined") throw new Error("createOrden debe ejecutarse en el browser");
  seedOrdenesIfEmpty();

  const now = new Date().toISOString();
  const nuevo: Orden = {
    id: uid("ord"),
    numero: nextNumero(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };

  const list = safeParse<Orden[]>(localStorage.getItem(KEY_ORD), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_ORD, JSON.stringify(list));
  return nuevo;
}

export function updateOrden(id: string, patch: Partial<Orden>): Orden {
  if (typeof window === "undefined") throw new Error("updateOrden debe ejecutarse en el browser");
  seedOrdenesIfEmpty();

  const list = safeParse<Orden[]>(localStorage.getItem(KEY_ORD), []);
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Orden no existe");

  const updated: Orden = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  localStorage.setItem(KEY_ORD, JSON.stringify(list));
  return updated;
}

export function deleteOrden(id: string) {
  if (typeof window === "undefined") throw new Error("deleteOrden debe ejecutarse en el browser");
  seedOrdenesIfEmpty();
  const list = safeParse<Orden[]>(localStorage.getItem(KEY_ORD), []);
  localStorage.setItem(KEY_ORD, JSON.stringify(list.filter((o) => o.id !== id)));
}

/* =========================
   Checklist Templates
========================= */
export function listChecklistTemplates(search = ""): ChecklistTemplate[] {
  if (typeof window === "undefined") return [];
  seedChecklistsIfEmpty();

  const list = safeParse<ChecklistTemplate[]>(localStorage.getItem(KEY_TPL), []);
  const q = search.trim().toLowerCase();

  return list
    .filter((t) => {
      if (!q) return true;
      return [t.nombre, ...t.items.map(i => i.label)].join(" ").toLowerCase().includes(q);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getChecklistTemplate(id: string): ChecklistTemplate | null {
  if (typeof window === "undefined") return null;
  seedChecklistsIfEmpty();
  const list = safeParse<ChecklistTemplate[]>(localStorage.getItem(KEY_TPL), []);
  return list.find((t) => t.id === id) ?? null;
}

export function createChecklistTemplate(nombre: string): ChecklistTemplate {
  if (typeof window === "undefined") throw new Error("createChecklistTemplate debe ejecutarse en el browser");
  seedChecklistsIfEmpty();

  const now = new Date().toISOString();
  const tpl: ChecklistTemplate = {
    id: uid("tpl"),
    nombre: nombre.trim() || "Nuevo checklist",
    items: [{ label: "Nuevo ítem" }],
    createdAt: now,
    updatedAt: now,
  };

  const list = safeParse<ChecklistTemplate[]>(localStorage.getItem(KEY_TPL), []);
  list.unshift(tpl);
  localStorage.setItem(KEY_TPL, JSON.stringify(list));
  return tpl;
}

export function updateChecklistTemplate(id: string, patch: Partial<ChecklistTemplate>): ChecklistTemplate {
  if (typeof window === "undefined") throw new Error("updateChecklistTemplate debe ejecutarse en el browser");
  seedChecklistsIfEmpty();

  const list = safeParse<ChecklistTemplate[]>(localStorage.getItem(KEY_TPL), []);
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Checklist template no existe");

  const updated: ChecklistTemplate = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  localStorage.setItem(KEY_TPL, JSON.stringify(list));
  return updated;
}

export function deleteChecklistTemplate(id: string) {
  if (typeof window === "undefined") throw new Error("deleteChecklistTemplate debe ejecutarse en el browser");
  seedChecklistsIfEmpty();
  const list = safeParse<ChecklistTemplate[]>(localStorage.getItem(KEY_TPL), []);
  localStorage.setItem(KEY_TPL, JSON.stringify(list.filter((t) => t.id !== id)));
}
