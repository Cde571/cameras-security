type HistorialCliente = {
  id: string;
  clienteId: string;
  fecha: string;
  tipo: string;
  titulo: string;
  descripcion?: string;
  meta?: Record<string, any> | null;
};

const STORAGE_KEY = "cliente_historial_v1";

function hasWindow() {
  return typeof window !== "undefined";
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readAll(): HistorialCliente[] {
  if (!hasWindow()) return [];
  return safeParse<HistorialCliente[]>(window.localStorage.getItem(STORAGE_KEY), []);
}

function writeAll(items: HistorialCliente[]) {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function normalizeEntry(input: Partial<HistorialCliente> & { clienteId: string }): HistorialCliente {
  return {
    id: String(input.id ?? makeId()),
    clienteId: String(input.clienteId ?? ""),
    fecha: String(input.fecha ?? new Date().toISOString()),
    tipo: String(input.tipo ?? "nota"),
    titulo: String(input.titulo ?? "Movimiento"),
    descripcion: input.descripcion ? String(input.descripcion) : "",
    meta: input.meta ?? null,
  };
}

export function listHistorialCliente(clienteId: string): HistorialCliente[] {
  const id = String(clienteId ?? "").trim();
  if (!id) return [];

  return readAll()
    .filter((item) => item.clienteId === id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function getHistorialCliente(clienteId: string): HistorialCliente[] {
  return listHistorialCliente(clienteId);
}

export function getClienteHistorial(clienteId: string): HistorialCliente[] {
  return listHistorialCliente(clienteId);
}

export function addHistorialCliente(
  clienteId: string,
  entry: Partial<HistorialCliente> & { titulo?: string; descripcion?: string; tipo?: string; meta?: Record<string, any> | null }
): HistorialCliente {
  const normalized = normalizeEntry({
    clienteId,
    titulo: entry?.titulo ?? "Movimiento",
    descripcion: entry?.descripcion ?? "",
    tipo: entry?.tipo ?? "nota",
    fecha: entry?.fecha,
    meta: entry?.meta ?? null,
    id: entry?.id,
  });

  const current = readAll();
  current.push(normalized);
  writeAll(current);

  return normalized;
}

export function appendHistorialCliente(
  clienteId: string,
  entry: Partial<HistorialCliente> & { titulo?: string; descripcion?: string; tipo?: string; meta?: Record<string, any> | null }
): HistorialCliente {
  return addHistorialCliente(clienteId, entry);
}

export function registrarMovimientoCliente(
  clienteId: string,
  payload: { titulo?: string; descripcion?: string; tipo?: string; meta?: Record<string, any> | null }
): HistorialCliente {
  return addHistorialCliente(clienteId, payload);
}

export function saveHistorialCliente(
  clienteId: string,
  entries: Array<Partial<HistorialCliente>>
): HistorialCliente[] {
  const id = String(clienteId ?? "").trim();
  if (!id) return [];

  const others = readAll().filter((item) => item.clienteId !== id);
  const normalized = (Array.isArray(entries) ? entries : []).map((entry) =>
    normalizeEntry({
      ...entry,
      clienteId: id,
    })
  );

  writeAll([...others, ...normalized]);
  return listHistorialCliente(id);
}

export function deleteHistorialCliente(clienteId: string, historialId: string): boolean {
  const cliente = String(clienteId ?? "").trim();
  const historial = String(historialId ?? "").trim();

  if (!cliente || !historial) return false;

  const current = readAll();
  const next = current.filter((item) => !(item.clienteId === cliente && item.id === historial));

  writeAll(next);
  return next.length !== current.length;
}

export function clearHistorialCliente(clienteId: string): void {
  const id = String(clienteId ?? "").trim();
  if (!id) return;

  const next = readAll().filter((item) => item.clienteId !== id);
  writeAll(next);
}

export function exportClienteJson(clienteId: string, filename?: string): void {
  if (!hasWindow()) {
    throw new Error("Esta función solo se puede usar en el navegador.");
  }

  const historial = listHistorialCliente(clienteId);
  const payload = {
    clienteId,
    exportedAt: new Date().toISOString(),
    total: historial.length,
    items: historial,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `cliente-${clienteId}-historial.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const clienteHistorialService = {
  listHistorialCliente,
  getHistorialCliente,
  getClienteHistorial,
  addHistorialCliente,
  appendHistorialCliente,
  registrarMovimientoCliente,
  saveHistorialCliente,
  deleteHistorialCliente,
  clearHistorialCliente,
  exportClienteJson,
};

export type { HistorialCliente };