import { apiRequest, isDemoMode } from "./httpClient";
import * as Local from "./cotizacionLocalService";

export async function listarCotizaciones(q = "") {
  try {
    if (isDemoMode() && typeof Local.listCotizaciones === "function") {
      return Local.listCotizaciones(q);
    }

    const url = q ? `/api/cotizaciones?q=${encodeURIComponent(q)}` : "/api/cotizaciones";
    const data = await apiRequest(url);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.warn("[cotizacionService] fallback local listarCotizaciones:", error);
    return typeof Local.listCotizaciones === "function" ? Local.listCotizaciones(q) : [];
  }
}

export async function obtenerCotizacion(id: string) {
  try {
    if (isDemoMode() && typeof Local.getCotizacion === "function") {
      return Local.getCotizacion(id);
    }

    const data = await apiRequest(`/api/cotizaciones/${encodeURIComponent(id)}`);
    return data?.item ?? null;
  } catch (error) {
    console.warn("[cotizacionService] fallback local obtenerCotizacion:", error);
    return typeof Local.getCotizacion === "function" ? Local.getCotizacion(id) : null;
  }
}

export async function crearCotizacion(payload: any) {
  try {
    if (isDemoMode() && typeof Local.createCotizacion === "function") {
      return Local.createCotizacion(payload);
    }

    const data = await apiRequest("/api/cotizaciones", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[cotizacionService] fallback local crearCotizacion:", error);
    return typeof Local.createCotizacion === "function" ? Local.createCotizacion(payload) : payload;
  }
}

export async function actualizarCotizacion(id: string, payload: any) {
  try {
    if (isDemoMode() && typeof Local.updateCotizacion === "function") {
      return Local.updateCotizacion(id, payload);
    }

    const data = await apiRequest(`/api/cotizaciones/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[cotizacionService] fallback local actualizarCotizacion:", error);
    return typeof Local.updateCotizacion === "function" ? Local.updateCotizacion(id, payload) : payload;
  }
}

export async function eliminarCotizacion(id: string) {
  try {
    if (isDemoMode() && typeof Local.deleteCotizacion === "function") {
      return Local.deleteCotizacion(id);
    }

    await apiRequest(`/api/cotizaciones/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("[cotizacionService] fallback local eliminarCotizacion:", error);
    if (typeof Local.deleteCotizacion === "function") {
      return Local.deleteCotizacion(id);
    }
  }
}

export const listCotizaciones = listarCotizaciones;
export const getCotizacion = obtenerCotizacion;
export const createCotizacion = crearCotizacion;
export const updateCotizacion = actualizarCotizacion;
export const deleteCotizacion = eliminarCotizacion;

export const cotizacionService = {
  listarCotizaciones,
  listCotizaciones,
  obtenerCotizacion,
  getCotizacion,
  crearCotizacion,
  createCotizacion,
  actualizarCotizacion,
  updateCotizacion,
  eliminarCotizacion,
  deleteCotizacion,
};