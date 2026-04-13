export type ActaStatus = "borrador" | "firmada" | "enviada" | "anulada";

export type ClienteSnapshot = {
  id: string;
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
};

export type ActivoEntregado = {
  id: string;
  tipo: "camara" | "dvr_nvr" | "disco" | "accesorio" | "cableado" | "otro";
  descripcion: string;
  cantidad: number;
  serial?: string;
  ubicacion?: string;
  notas?: string;
};

export type ActaEntrega = {
  id: string;
  numero: string; // ACT-YYYY-####
  clienteId: string;
  cliente: ClienteSnapshot;

  fecha: string; // ISO date
  lugar?: string;
  ordenId?: string;

  responsables?: {
    tecnico?: string;
    clienteRecibe?: string;
    documentoRecibe?: string;
  };

  activos: ActivoEntregado[];
  observaciones?: string;

  firmaClienteDataUrl?: string; // firma en base64 (canvas)
  status: ActaStatus;

  createdAt: string;
  updatedAt: string;
};

const KEY_ACTAS = "coti_actas_v1";
const KEY_SEQ_ACT = "coti_actas_seq_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try { return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
}

function uid(prefix: string) {
  return (globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

function nextNumeroActa(): string {
  if (typeof window === "undefined") return "ACT-0000-0000";
  const year = new Date().getFullYear();
  const cur = safeParse<Record<string, number>>(localStorage.getItem(KEY_SEQ_ACT), {});
  const n = (cur[String(year)] ?? 0) + 1;
  cur[String(year)] = n;
  localStorage.setItem(KEY_SEQ_ACT, JSON.stringify(cur));
  return `ACT-${year}-${String(n).padStart(4, "0")}`;
}

function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const list = safeParse<ActaEntrega[]>(localStorage.getItem(KEY_ACTAS), []);
  if (list.length > 0) return;

  const now = new Date().toISOString();
  const hoy = new Date().toISOString().slice(0, 10);

  const cliente: ClienteSnapshot = {
    id: "seed",
    nombre: "Clínica San Rafael",
    documento: "800555222-9",
    ciudad: "Bogotá",
  };

  const acta: ActaEntrega = {
    id: uid("act"),
    numero: nextNumeroActa(),
    clienteId: cliente.id,
    cliente,
    fecha: hoy,
    lugar: "Sede principal",
    responsables: { tecnico: "Técnico 1", clienteRecibe: "Jefe de compras", documentoRecibe: "CC 123456" },
    activos: [
      { id: uid("itm"), tipo: "camara", descripcion: "Cámara IP 4MP", cantidad: 8, ubicacion: "Perímetro", notas: "OK" },
      { id: uid("itm"), tipo: "dvr_nvr", descripcion: "NVR 16ch", cantidad: 1, serial: "SN-001", ubicacion: "Rack", notas: "OK" },
      { id: uid("itm"), tipo: "disco", descripcion: "Disco duro 4TB", cantidad: 1, serial: "HDD-4TB-01", notas: "Instalado" },
    ],
    observaciones: "Se realiza entrega y pruebas básicas de visualización. Capacitación breve al usuario.",
    status: "borrador",
    createdAt: now,
    updatedAt: now,
  };

  localStorage.setItem(KEY_ACTAS, JSON.stringify([acta]));
}

export function listActas(search = ""): ActaEntrega[] {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  const list = safeParse<ActaEntrega[]>(localStorage.getItem(KEY_ACTAS), []);
  const q = search.trim().toLowerCase();

  if (!q) return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return list
    .filter((a) => {
      const blob = [a.numero, a.cliente?.nombre, a.fecha, a.status, a.lugar]
        .filter(Boolean).join(" ").toLowerCase();
      return blob.includes(q);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getActa(id: string): ActaEntrega | null {
  if (typeof window === "undefined") return null;
  seedIfEmpty();
  const list = safeParse<ActaEntrega[]>(localStorage.getItem(KEY_ACTAS), []);
  return list.find((a) => a.id === id) ?? null;
}

export function createActa(data: Omit<ActaEntrega, "id" | "numero" | "createdAt" | "updatedAt">): ActaEntrega {
  if (typeof window === "undefined") throw new Error("createActa debe ejecutarse en el browser");
  seedIfEmpty();
  const now = new Date().toISOString();

  const acta: ActaEntrega = {
    id: uid("act"),
    numero: nextNumeroActa(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };

  const list = safeParse<ActaEntrega[]>(localStorage.getItem(KEY_ACTAS), []);
  list.unshift(acta);
  localStorage.setItem(KEY_ACTAS, JSON.stringify(list));
  return acta;
}

export function updateActa(id: string, patch: Partial<ActaEntrega>): ActaEntrega {
  if (typeof window === "undefined") throw new Error("updateActa debe ejecutarse en el browser");
  seedIfEmpty();
  const list = safeParse<ActaEntrega[]>(localStorage.getItem(KEY_ACTAS), []);
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Acta no existe");

  const updated: ActaEntrega = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  localStorage.setItem(KEY_ACTAS, JSON.stringify(list));
  return updated;
}

export function deleteActa(id: string) {
  if (typeof window === "undefined") throw new Error("deleteActa debe ejecutarse en el browser");
  seedIfEmpty();
  const list = safeParse<ActaEntrega[]>(localStorage.getItem(KEY_ACTAS), []);
  localStorage.setItem(KEY_ACTAS, JSON.stringify(list.filter((a) => a.id !== id)));
}
