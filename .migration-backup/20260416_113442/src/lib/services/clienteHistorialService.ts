import type {
  ClienteDuplicadoResult,
  ClienteHistorialData,
} from "../../types/clienteHistorial";

function toNumber(value: any): number {
  const n = Number(
    typeof value === "string"
      ? value.replace(/\./g, "").replace(",", ".")
      : value
  );
  return Number.isFinite(n) ? n : 0;
}

function normalizeText(value: any): string {
  return String(value ?? "").trim().toLowerCase();
}

function readLocal<T>(key: string): T[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function byClienteId(items: any[], clienteId: string) {
  return items.filter((item) => {
    const fk = String(
      item?.clienteId ??
      item?.cliente_id ??
      item?.clientId ??
      item?.cliente?.id ??
      ""
    );
    return fk === clienteId;
  });
}

function first(...values: any[]) {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}

function buildLocalHistorial(clienteId: string): ClienteHistorialData {
  const clientes = readLocal<any>("clientes");
  const cotizaciones = readLocal<any>("cotizaciones");
  const ordenes = readLocal<any>("ordenes");
  const cobros = readLocal<any>("cobros");
  const pagos = readLocal<any>("pagos");

  const cliente = clientes.find((c) => String(c.id) === clienteId) ?? null;

  const cotCliente = byClienteId(cotizaciones, clienteId);
  const ordCliente = byClienteId(ordenes, clienteId);
  const cobCliente = byClienteId(cobros, clienteId);
  const pagosCliente = pagos.filter((p) => {
    const cobroId = String(first(p?.cobroId, p?.cuentaCobroId, p?.cuenta_cobro_id, ""));
    return cobCliente.some((c) => String(c.id) === cobroId);
  });

  const totalCotizado = cotCliente.reduce((sum, x) => sum + toNumber(first(x.total, x.totalGeneral, x.valorTotal, 0)), 0);
  const totalCobrado = cobCliente.reduce((sum, x) => sum + toNumber(first(x.total, x.totalGeneral, x.valorTotal, 0)), 0);
  const totalPagado = pagosCliente.reduce((sum, x) => sum + toNumber(first(x.valor, x.monto, 0)), 0);

  const docs = [
    ...cotCliente.map((x) => ({
      id: String(x.id),
      tipo: "cotizacion" as const,
      numero: String(first(x.numero, `COT-${String(x.id).slice(0, 8)}`)),
      fecha: String(first(x.fecha, x.createdAt, new Date().toISOString())),
      estado: String(first(x.status, x.estado, "pendiente")),
      total: toNumber(first(x.total, x.totalGeneral, x.valorTotal, 0)),
      href: `/cotizaciones/${String(x.id)}`,
    })),
    ...ordCliente.map((x) => ({
      id: String(x.id),
      tipo: "orden" as const,
      numero: String(first(x.numero, `OT-${String(x.id).slice(0, 8)}`)),
      fecha: String(first(x.fecha, x.createdAt, new Date().toISOString())),
      estado: String(first(x.status, x.estado, "pendiente")),
      total: 0,
      href: `/ordenes/${String(x.id)}`,
    })),
    ...cobCliente.map((x) => ({
      id: String(x.id),
      tipo: "cobro" as const,
      numero: String(first(x.numero, `CC-${String(x.id).slice(0, 8)}`)),
      fecha: String(first(x.fecha, x.createdAt, new Date().toISOString())),
      estado: String(first(x.status, x.estado, "pendiente")),
      total: toNumber(first(x.total, x.totalGeneral, x.valorTotal, 0)),
      href: `/cobros/${String(x.id)}`,
    })),
    ...pagosCliente.map((x) => ({
      id: String(x.id),
      tipo: "pago" as const,
      numero: String(first(x.numero, x.referencia, `PG-${String(x.id).slice(0, 8)}`)),
      fecha: String(first(x.fecha, x.createdAt, new Date().toISOString())),
      estado: String(first(x.status, x.estado, "registrado")),
      total: toNumber(first(x.valor, x.monto, 0)),
      href: `/pagos/${String(x.id)}`,
    })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return {
    cliente: cliente
      ? {
          id: String(cliente.id),
          nombre: String(first(cliente.nombre, "Sin nombre")),
          documento: String(first(cliente.documento, "")) || undefined,
          email: String(first(cliente.email, "")) || undefined,
          telefono: String(first(cliente.telefono, "")) || undefined,
          ciudad: String(first(cliente.ciudad, "")) || undefined,
        }
      : null,
    resumen: {
      cotizaciones: cotCliente.length,
      ordenes: ordCliente.length,
      cobros: cobCliente.length,
      pagos: pagosCliente.length,
      totalCotizado,
      totalCobrado,
      totalPagado,
      saldoPendiente: Math.max(totalCobrado - totalPagado, 0),
    },
    documentos: docs,
  };
}

export async function getClienteHistorial(clienteId: string): Promise<ClienteHistorialData> {
  try {
    const res = await fetch(`/api/clientes/${clienteId}/historial`);
    if (!res.ok) throw new Error("historial api error");
    const data = await res.json();
    if (!data?.ok || !data?.data) throw new Error("historial api invalid");
    return data.data as ClienteHistorialData;
  } catch {
    return buildLocalHistorial(clienteId);
  }
}

export async function exportClienteJson(clienteId: string) {
  const data = await getClienteHistorial(clienteId);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cliente-${clienteId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function validateClienteDuplicado(input: {
  id?: string;
  documento?: string;
  email?: string;
  telefono?: string;
}): Promise<ClienteDuplicadoResult> {
  try {
    const res = await fetch("/api/clientes/validate-duplicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("duplicate api error");
    return (await res.json()) as ClienteDuplicadoResult;
  } catch {
    const clientes = readLocal<any>("clientes");
    const currentId = String(input.id ?? "");
    const doc = normalizeText(input.documento);
    const email = normalizeText(input.email);
    const tel = normalizeText(input.telefono);

    const matches = clientes.filter((c) => {
      if (currentId && String(c.id) === currentId) return false;
      const sameDoc = doc && normalizeText(c.documento) === doc;
      const sameEmail = email && normalizeText(c.email) === email;
      const sameTel = tel && normalizeText(c.telefono) === tel;
      return sameDoc || sameEmail || sameTel;
    });

    return {
      ok: true,
      duplicated: matches.length > 0,
      matches: matches.map((c) => ({
        id: String(c.id),
        nombre: String(c.nombre ?? "Sin nombre"),
        documento: c.documento ?? undefined,
        email: c.email ?? undefined,
        telefono: c.telefono ?? undefined,
      })),
    };
  }
}
