import { apiRequest, isDemoMode } from "./httpClient";
import * as Local from "./ordenLocalService";

export async function listarOrdenes() {
  try {
    if (isDemoMode() && typeof Local.listOrdenes === "function") {
      return Local.listOrdenes();
    }

    const data = await apiRequest("/api/ordenes");
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.warn("[ordenService] fallback local listarOrdenes:", error);
    return typeof Local.listOrdenes === "function" ? Local.listOrdenes() : [];
  }
}

export async function crearOrden(payload: any) {
  try {
    if (isDemoMode() && typeof Local.createOrden === "function") {
      return Local.createOrden(payload);
    }

    const data = await apiRequest("/api/ordenes", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[ordenService] fallback local crearOrden:", error);
    return typeof Local.createOrden === "function" ? Local.createOrden(payload) : payload;
  }
}

export const listOrdenes = listarOrdenes;
export const createOrden = crearOrden;

export const ordenService = {
  listarOrdenes,
  listOrdenes,
  crearOrden,
  createOrden,
};