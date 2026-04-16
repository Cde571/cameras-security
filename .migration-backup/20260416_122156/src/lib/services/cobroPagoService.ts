import { cobroPagoLocalService } from "./cobroPagoLocalService";

function isBrowser() {
  return typeof window !== "undefined";
}

function isDemoMode() {
  if (!isBrowser()) return false;
  return window.localStorage.getItem("demoMode") === "true";
}

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("La API devolvió una respuesta no válida");
  }
}

async function request(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (response.status === 204) return null;

  const data = await parseJsonSafe(response);

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || `Error HTTP ${response.status}`);
  }

  return data;
}

function normalizeCobro(raw: any) {
  return {
    id: String(raw?.id ?? ""),
    numero: raw?.numero ?? "",
    clienteId: raw?.clienteId ?? raw?.cliente_id ?? "",
    cliente: raw?.cliente ?? null,
    fechaEmision: raw?.fechaEmision ?? raw?.fecha_emision ?? "",
    fechaVencimiento: raw?.fechaVencimiento ?? raw?.fecha_vencimiento ?? "",
    status: raw?.status ?? "pendiente",
    servicios: Array.isArray(raw?.servicios) ? raw.servicios : [],
    observaciones: raw?.observaciones ?? raw?.notas ?? "",
    subtotal: Number(raw?.subtotal ?? 0),
    iva: Number(raw?.iva ?? 0),
    total: Number(raw?.total ?? 0),
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? new Date().toISOString(),
  };
}

function normalizePago(raw: any) {
  return {
    id: String(raw?.id ?? ""),
    fecha: raw?.fecha ?? "",
    clienteId: raw?.clienteId ?? raw?.cliente_id ?? "",
    cliente: raw?.cliente ?? null,
    cobroId: raw?.cobroId ?? raw?.cuenta_cobro_id ?? raw?.cuentaCobroId ?? "",
    referencia: raw?.referencia ?? "",
    metodo: raw?.metodo ?? "transferencia",
    valor: Number(raw?.valor ?? 0),
    notas: raw?.notas ?? "",
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? new Date().toISOString(),
  };
}

export async function listarCobros(q = "") {
  try {
    if (isDemoMode()) return cobroPagoLocalService.listarCobros(q);

    const url = q ? `/api/cobros?q=${encodeURIComponent(q)}` : "/api/cobros";
    const data = await request(url);
    return Array.isArray(data?.items) ? data.items.map(normalizeCobro) : [];
  } catch (error) {
    console.warn("[cobroPagoService] fallback local listarCobros:", error);
    return cobroPagoLocalService.listarCobros(q);
  }
}

export async function obtenerCobro(id: string) {
  try {
    if (isDemoMode()) return cobroPagoLocalService.obtenerCobroPorId(id) ?? null;

    const data = await request(`/api/cobros/${id}`);
    return data?.item ? normalizeCobro(data.item) : null;
  } catch (error) {
    console.warn("[cobroPagoService] fallback local obtenerCobro:", error);
    return cobroPagoLocalService.obtenerCobroPorId(id) ?? null;
  }
}

export async function crearCobro(payload: any) {
  try {
    if (isDemoMode()) return cobroPagoLocalService.crearCobro(payload);

    const data = await request("/api/cobros", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return normalizeCobro(data.item);
  } catch (error) {
    console.warn("[cobroPagoService] fallback local crearCobro:", error);
    return cobroPagoLocalService.crearCobro(payload);
  }
}

export async function actualizarCobro(id: string, payload: any) {
  try {
    if (isDemoMode()) return cobroPagoLocalService.actualizarCobro(id, payload);

    const data = await request(`/api/cobros/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    return normalizeCobro(data.item);
  } catch (error) {
    console.warn("[cobroPagoService] fallback local actualizarCobro:", error);
    return cobroPagoLocalService.actualizarCobro(id, payload);
  }
}

export async function eliminarCobro(id: string) {
  try {
    if (isDemoMode()) {
      cobroPagoLocalService.eliminarCobro(id);
      return;
    }

    await request(`/api/cobros/${id}`, { method: "DELETE" });
  } catch (error) {
    console.warn("[cobroPagoService] fallback local eliminarCobro:", error);
    cobroPagoLocalService.eliminarCobro(id);
  }
}

export async function listarPagos(q = "") {
  try {
    if (isDemoMode()) return cobroPagoLocalService.listarPagos(q);

    const url = q ? `/api/pagos?q=${encodeURIComponent(q)}` : "/api/pagos";
    const data = await request(url);
    return Array.isArray(data?.items) ? data.items.map(normalizePago) : [];
  } catch (error) {
    console.warn("[cobroPagoService] fallback local listarPagos:", error);
    return cobroPagoLocalService.listarPagos(q);
  }
}

export async function crearPago(payload: any) {
  try {
    if (isDemoMode()) return cobroPagoLocalService.crearPago(payload);

    const data = await request("/api/pagos", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return normalizePago(data.item);
  } catch (error) {
    console.warn("[cobroPagoService] fallback local crearPago:", error);
    return cobroPagoLocalService.crearPago(payload);
  }
}

export async function eliminarPago(id: string) {
  try {
    if (isDemoMode()) {
      cobroPagoLocalService.eliminarPago(id);
      return;
    }

    await request(`/api/pagos/${id}`, { method: "DELETE" });
  } catch (error) {
    console.warn("[cobroPagoService] fallback local eliminarPago:", error);
    cobroPagoLocalService.eliminarPago(id);
  }
}

export function calcularSaldoCobro(cobro: any, pagos: any[]) {
  const total = Number(cobro?.total ?? 0);
  const abonado = (Array.isArray(pagos) ? pagos : [])
    .filter((p) => (p?.cobroId ?? p?.cuentaCobroId ?? "") === cobro?.id)
    .reduce((acc, p) => acc + Number(p?.valor ?? 0), 0);

  const saldo = Math.max(0, total - abonado);

  return {
    total,
    abonado,
    saldo,
    status:
      saldo <= 0
        ? "pagado"
        : abonado > 0
          ? "parcial"
          : (cobro?.status ?? "pendiente"),
  };
}

export const cobroPagoService = {
  listarCobros,
  obtenerCobroPorId: obtenerCobro,
  obtenerCobro,
  crearCobro,
  actualizarCobro,
  eliminarCobro,
  listarPagos,
  crearPago,
  eliminarPago,
  calcularSaldoCobro,
};