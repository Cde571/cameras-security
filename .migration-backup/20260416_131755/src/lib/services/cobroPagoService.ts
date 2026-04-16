import { apiRequest, isDemoMode } from "./httpClient";
import * as Local from "./cobroPagoLocalService";

export async function listarCobros(q = "") {
  try {
    if (isDemoMode() && typeof Local.listarCobros === "function") {
      return Local.listarCobros(q);
    }

    const url = q ? `/api/cobros?q=${encodeURIComponent(q)}` : "/api/cobros";
    const data = await apiRequest(url);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.warn("[cobroPagoService] fallback local listarCobros:", error);
    return typeof Local.listarCobros === "function" ? Local.listarCobros(q) : [];
  }
}

export async function crearCobro(payload: any) {
  try {
    if (isDemoMode() && typeof Local.crearCobro === "function") {
      return Local.crearCobro(payload);
    }

    const data = await apiRequest("/api/cobros", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[cobroPagoService] fallback local crearCobro:", error);
    return typeof Local.crearCobro === "function" ? Local.crearCobro(payload) : payload;
  }
}

export async function listarPagos() {
  try {
    if (isDemoMode() && typeof Local.listarPagos === "function") {
      return Local.listarPagos();
    }

    const data = await apiRequest("/api/pagos");
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.warn("[cobroPagoService] fallback local listarPagos:", error);
    return typeof Local.listarPagos === "function" ? Local.listarPagos() : [];
  }
}

export async function crearPago(payload: any) {
  try {
    if (isDemoMode() && typeof Local.crearPago === "function") {
      return Local.crearPago(payload);
    }

    const data = await apiRequest("/api/pagos", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[cobroPagoService] fallback local crearPago:", error);
    return typeof Local.crearPago === "function" ? Local.crearPago(payload) : payload;
  }
}

export function calcularSaldoCobro(cobro: any, pagos: any[]) {
  const total = Number(cobro?.total ?? 0);
  const abonado = (Array.isArray(pagos) ? pagos : [])
    .filter((p) => (p?.cuentaCobroId ?? p?.cobroId ?? "") === cobro?.id)
    .reduce((acc, p) => acc + Number(p?.valor ?? p?.monto ?? 0), 0);

  const saldo = Math.max(0, total - abonado);

  return {
    total,
    abonado,
    saldo,
    status: saldo <= 0 ? "pagado" : abonado > 0 ? "parcial" : (cobro?.status ?? "pendiente"),
  };
}

export const listCobros = listarCobros;
export const createCobro = crearCobro;
export const listPagos = listarPagos;
export const createPago = crearPago;

export const cobroPagoService = {
  listarCobros,
  listCobros,
  crearCobro,
  createCobro,
  listarPagos,
  listPagos,
  crearPago,
  createPago,
  calcularSaldoCobro,
};