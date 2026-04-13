export type CobroStatus = "pendiente" | "enviado" | "pagado" | "vencido" | "anulado";

export type ClienteSnapshot = {
  id: string;
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
};

export type ServicioCobro = {
  id: string;
  descripcion: string;
  cantidad: number;
  unitario: number;
  ivaPct?: number; // opcional
};

export type CuentaCobro = {
  id: string;
  numero: string; // CC-YYYY-####

  clienteId: string;
  cliente: ClienteSnapshot;

  fechaEmision: string;    // ISO date
  fechaVencimiento: string;// ISO date
  status: CobroStatus;

  servicios: ServicioCobro[];
  observaciones?: string;

  subtotal: number;
  iva: number;
  total: number;

  createdAt: string;
  updatedAt: string;
};

export type PagoMetodo = "efectivo" | "transferencia" | "tarjeta" | "pse" | "otro";

export type Pago = {
  id: string;
  fecha: string; // ISO date
  clienteId: string;
  cliente: ClienteSnapshot;

  cobroId?: string;
  referencia?: string;
  metodo: PagoMetodo;
  valor: number;
  notas?: string;

  createdAt: string;
  updatedAt: string;
};

const KEY_COBROS = "coti_cobros_v1";
const KEY_PAGOS  = "coti_pagos_v1";
const KEY_SEQ_CC = "coti_cobros_seq_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try { return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
}

function uid(prefix: string) {
  return (globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

function nextNumeroCC(): string {
  if (typeof window === "undefined") return "CC-0000-0000";
  const year = new Date().getFullYear();
  const cur = safeParse<Record<string, number>>(localStorage.getItem(KEY_SEQ_CC), {});
  const n = (cur[String(year)] ?? 0) + 1;
  cur[String(year)] = n;
  localStorage.setItem(KEY_SEQ_CC, JSON.stringify(cur));
  return `CC-${year}-${String(n).padStart(4, "0")}`;
}

function calcTotales(servicios: ServicioCobro[]) {
  const subtotal = servicios.reduce((acc, s) => acc + (Number(s.cantidad || 0) * Number(s.unitario || 0)), 0);
  const iva = servicios.reduce((acc, s) => {
    const pct = Number(s.ivaPct || 0);
    return acc + (Number(s.cantidad || 0) * Number(s.unitario || 0) * (pct / 100));
  }, 0);
  const total = subtotal + iva;
  return { subtotal, iva, total };
}

function seedIfEmpty() {
  if (typeof window === "undefined") return;

  const cobros = safeParse<CuentaCobro[]>(localStorage.getItem(KEY_COBROS), []);
  const pagos  = safeParse<Pago[]>(localStorage.getItem(KEY_PAGOS), []);
  if (cobros.length > 0 || pagos.length > 0) return;

  const now = new Date().toISOString();
  const hoy = new Date().toISOString().slice(0, 10);
  const venc = new Date(Date.now() + 7*24*3600*1000).toISOString().slice(0, 10);

  const cliente: ClienteSnapshot = { id: "seed", nombre: "Supermercado El Ahorro", documento: "901987654-1", ciudad: "Cali" };

  const servicios: ServicioCobro[] = [
    { id: uid("srv"), descripcion: "Mantenimiento preventivo CCTV", cantidad: 1, unitario: 850000, ivaPct: 19 },
    { id: uid("srv"), descripcion: "Cambio de conector / ajuste canaleta", cantidad: 2, unitario: 65000, ivaPct: 19 },
  ];

  const t = calcTotales(servicios);
  const cc: CuentaCobro = {
    id: uid("cc"),
    numero: nextNumeroCC(),
    clienteId: cliente.id,
    cliente,
    fechaEmision: hoy,
    fechaVencimiento: venc,
    status: "pendiente",
    servicios,
    observaciones: "Pago contra entrega. Enviar soporte al WhatsApp.",
    ...t,
    createdAt: now,
    updatedAt: now,
  };

  localStorage.setItem(KEY_COBROS, JSON.stringify([cc]));
  localStorage.setItem(KEY_PAGOS, JSON.stringify([]));
}

/* =========================
   Cobros CRUD
========================= */
export function listCobros(search = ""): CuentaCobro[] {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  const list = safeParse<CuentaCobro[]>(localStorage.getItem(KEY_COBROS), []);
  const q = search.trim().toLowerCase();

  const normalized = list.map((c) => {
    // Auto-marcar vencido si aplica
    if ((c.status === "pendiente" || c.status === "enviado") && c.fechaVencimiento) {
      const today = new Date().toISOString().slice(0, 10);
      if (c.fechaVencimiento < today) return { ...c, status: "vencido" as const };
    }
    return c;
  });

  if (!q) return normalized.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return normalized
    .filter((c) => {
      const blob = [c.numero, c.cliente?.nombre, c.status, c.fechaEmision, c.fechaVencimiento]
        .filter(Boolean).join(" ").toLowerCase();
      return blob.includes(q);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getCobro(id: string): CuentaCobro | null {
  if (typeof window === "undefined") return null;
  seedIfEmpty();
  const list = safeParse<CuentaCobro[]>(localStorage.getItem(KEY_COBROS), []);
  return list.find((c) => c.id === id) ?? null;
}

export function createCobro(data: Omit<CuentaCobro, "id" | "numero" | "createdAt" | "updatedAt" | "subtotal" | "iva" | "total">): CuentaCobro {
  if (typeof window === "undefined") throw new Error("createCobro debe ejecutarse en el browser");
  seedIfEmpty();
  const now = new Date().toISOString();

  const totals = calcTotales(data.servicios || []);
  const cc: CuentaCobro = {
    id: uid("cc"),
    numero: nextNumeroCC(),
    createdAt: now,
    updatedAt: now,
    ...data,
    ...totals,
  };

  const list = safeParse<CuentaCobro[]>(localStorage.getItem(KEY_COBROS), []);
  list.unshift(cc);
  localStorage.setItem(KEY_COBROS, JSON.stringify(list));
  return cc;
}

export function updateCobro(id: string, patch: Partial<CuentaCobro>): CuentaCobro {
  if (typeof window === "undefined") throw new Error("updateCobro debe ejecutarse en el browser");
  seedIfEmpty();
  const list = safeParse<CuentaCobro[]>(localStorage.getItem(KEY_COBROS), []);
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Cuenta de cobro no existe");

  const merged = { ...list[idx], ...patch, id };
  const totals = calcTotales(merged.servicios || []);
  const updated: CuentaCobro = {
    ...merged,
    ...totals,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  localStorage.setItem(KEY_COBROS, JSON.stringify(list));
  return updated;
}

export function deleteCobro(id: string) {
  if (typeof window === "undefined") throw new Error("deleteCobro debe ejecutarse en el browser");
  seedIfEmpty();
  const list = safeParse<CuentaCobro[]>(localStorage.getItem(KEY_COBROS), []);
  localStorage.setItem(KEY_COBROS, JSON.stringify(list.filter((c) => c.id !== id)));
}

/* =========================
   Pagos CRUD + aplicacion a Cobro
========================= */
export function listPagos(search = ""): Pago[] {
  if (typeof window === "undefined") return [];
  seedIfEmpty();
  const list = safeParse<Pago[]>(localStorage.getItem(KEY_PAGOS), []);
  const q = search.trim().toLowerCase();

  if (!q) return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return list
    .filter((p) => {
      const blob = [p.cliente?.nombre, p.metodo, p.referencia, p.fecha, p.valor]
        .filter(Boolean).join(" ").toLowerCase();
      return blob.includes(q);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPago(data: Omit<Pago, "id" | "createdAt" | "updatedAt">): Pago {
  if (typeof window === "undefined") throw new Error("createPago debe ejecutarse en el browser");
  seedIfEmpty();
  const now = new Date().toISOString();

  const pago: Pago = {
    id: uid("pay"),
    createdAt: now,
    updatedAt: now,
    ...data,
  };

  const pagos = safeParse<Pago[]>(localStorage.getItem(KEY_PAGOS), []);
  pagos.unshift(pago);
  localStorage.setItem(KEY_PAGOS, JSON.stringify(pagos));

  // si aplica a un cobro, marcar pagado (front-first: pago total)
  if (pago.cobroId) {
    const cobros = safeParse<CuentaCobro[]>(localStorage.getItem(KEY_COBROS), []);
    const idx = cobros.findIndex(c => c.id === pago.cobroId);
    if (idx >= 0) {
      cobros[idx] = { ...cobros[idx], status: "pagado", updatedAt: now };
      localStorage.setItem(KEY_COBROS, JSON.stringify(cobros));
    }
  }

  return pago;
}

/* =========================
   Cartera / Estado de cuenta
========================= */
export function getCartera(): {
  pendientes: CuentaCobro[];
  vencidos: CuentaCobro[];
  pagados: CuentaCobro[];
  totalPendiente: number;
  totalVencido: number;
  totalPagado: number;
} {
  const cobros = listCobros("");
  const pendientes = cobros.filter(c => c.status === "pendiente" || c.status === "enviado");
  const vencidos   = cobros.filter(c => c.status === "vencido");
  const pagados    = cobros.filter(c => c.status === "pagado");

  const totalPendiente = pendientes.reduce((a, c) => a + (c.total || 0), 0);
  const totalVencido   = vencidos.reduce((a, c) => a + (c.total || 0), 0);
  const totalPagado    = pagados.reduce((a, c) => a + (c.total || 0), 0);

  return { pendientes, vencidos, pagados, totalPendiente, totalVencido, totalPagado };
}

export function getEstadoCuenta(clienteId: string): {
  cobros: CuentaCobro[];
  pagos: Pago[];
  saldo: number;
  totalCobros: number;
  totalPagos: number;
} {
  const cobros = listCobros("").filter(c => c.clienteId === clienteId);
  const pagos = listPagos("").filter(p => p.clienteId === clienteId);

  const totalCobros = cobros.reduce((a, c) => a + (c.total || 0), 0);
  const totalPagos = pagos.reduce((a, p) => a + (p.valor || 0), 0);
  const saldo = totalCobros - totalPagos;

  return { cobros, pagos, saldo, totalCobros, totalPagos };
}
