type Cobro = {
  id: string;
  numero?: string;
  clienteId?: string | null;
  fechaEmision?: string | null;
  fechaVencimiento?: string | null;
  status?: string;
  subtotal?: number;
  iva?: number;
  total?: number;
  observaciones?: string | null;
  items?: any[];
  [key: string]: any;
};

type Pago = {
  id: string;
  cuentaCobroId?: string | null;
  clienteId?: string | null;
  fecha?: string;
  metodo?: string;
  referencia?: string | null;
  valor?: number;
  notas?: string | null;
  [key: string]: any;
};

const COBROS_KEY = "cobro_pago_local_cobros_v1";
const PAGOS_KEY = "cobro_pago_local_pagos_v1";

function hasWindow() {
  return typeof window !== "undefined";
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!hasWindow()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function listarCobros(): Cobro[] {
  return readJson<Cobro[]>(COBROS_KEY, []);
}

export function obtenerCobroPorId(id: string): Cobro | null {
  return listarCobros().find((x) => x.id === id) ?? null;
}

export function crearCobro(payload: Partial<Cobro>): Cobro {
  const current = listarCobros();
  const item: Cobro = {
    id: String(payload?.id ?? makeId()),
    numero: payload?.numero ?? `CC-${Date.now()}`,
    clienteId: payload?.clienteId ?? null,
    fechaEmision: payload?.fechaEmision ?? new Date().toISOString().slice(0, 10),
    fechaVencimiento: payload?.fechaVencimiento ?? null,
    status: payload?.status ?? "pendiente",
    subtotal: Number(payload?.subtotal ?? payload?.total ?? 0),
    iva: Number(payload?.iva ?? 0),
    total: Number(payload?.total ?? 0),
    observaciones: payload?.observaciones ?? "",
    items: Array.isArray(payload?.items) ? payload.items : [],
    ...payload,
  };

  current.push(item);
  writeJson(COBROS_KEY, current);
  return item;
}

export function actualizarCobro(id: string, patch: Partial<Cobro>): Cobro | null {
  const current = listarCobros();
  const index = current.findIndex((x) => x.id === id);
  if (index < 0) return null;

  current[index] = { ...current[index], ...patch, id };
  writeJson(COBROS_KEY, current);
  return current[index];
}

export function eliminarCobro(id: string): boolean {
  const current = listarCobros();
  const next = current.filter((x) => x.id !== id);
  writeJson(COBROS_KEY, next);
  return next.length !== current.length;
}

export function listarPagos(): Pago[] {
  return readJson<Pago[]>(PAGOS_KEY, []);
}

export function crearPago(payload: Partial<Pago>): Pago {
  const current = listarPagos();
  const item: Pago = {
    id: String(payload?.id ?? makeId()),
    cuentaCobroId: payload?.cuentaCobroId ?? null,
    clienteId: payload?.clienteId ?? null,
    fecha: payload?.fecha ?? new Date().toISOString().slice(0, 10),
    metodo: payload?.metodo ?? "transferencia",
    referencia: payload?.referencia ?? "",
    valor: Number(payload?.valor ?? 0),
    notas: payload?.notas ?? "",
    ...payload,
  };

  current.push(item);
  writeJson(PAGOS_KEY, current);
  return item;
}

export const cobroPagoLocalService = {
  listarCobros,
  obtenerCobroPorId,
  crearCobro,
  actualizarCobro,
  eliminarCobro,
  listarPagos,
  crearPago,
};