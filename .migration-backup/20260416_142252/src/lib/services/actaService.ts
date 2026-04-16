import { apiRequest, isDemoMode } from "./httpClient";
import * as Local from "./actaLocalService";

export async function listarActas() {
  try {
    if (isDemoMode() && typeof Local.listActas === "function") {
      return Local.listActas();
    }

    const data = await apiRequest("/api/actas");
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.warn("[actaService] fallback local listarActas:", error);
    return typeof Local.listActas === "function" ? Local.listActas() : [];
  }
}

export async function crearActa(payload: any) {
  try {
    if (isDemoMode() && typeof Local.createActa === "function") {
      return Local.createActa(payload);
    }

    const data = await apiRequest("/api/actas", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[actaService] fallback local crearActa:", error);
    return typeof Local.createActa === "function" ? Local.createActa(payload) : payload;
  }
}

export const listActas = listarActas;
export const createActa = crearActa;

export const actaService = {
  listarActas,
  listActas,
  crearActa,
  createActa,
};