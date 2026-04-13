/**
 * API-first service with LocalService fallback.
 * - Front works now (localStorage)
 * - Later: implement /src/pages/api/... and these services will auto-use DB
 */
type FetchOpts = RequestInit & { json?: any };

async function apiFetch<T>(url: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as any),
  };

  const init: RequestInit = {
    ...opts,
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
  };

  const res = await fetch(url, init);
  const text = await res.text();

  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) ? (data.message || data.error) : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

function hasWindow() {
  return typeof window !== "undefined";
}

import * as Local from "./cotizacionLocalService";
export type {
  Cotizacion,
  CotizacionItem,
  CotizacionStatus,
  CotizacionItemKind,
  PlantillaTexto,
} from "./cotizacionLocalService";

const API = "/api/cotizaciones";

export async function listCotizaciones(search = "") {
  if (!hasWindow()) return [] as Local.Cotizacion[];
  try {
    return await apiFetch<Local.Cotizacion[]>(${API}?q=);
  } catch {
    return Local.listCotizaciones(search);
  }
}

export async function getCotizacion(id: string) {
  if (!hasWindow()) return null as Local.Cotizacion | null;
  try {
    return await apiFetch<Local.Cotizacion>(${API}/);
  } catch {
    return Local.getCotizacion(id);
  }
}

export async function createCotizacion(data: Omit<Local.Cotizacion, "id" | "numero" | "version" | "createdAt" | "updatedAt">) {
  if (!hasWindow()) throw new Error("createCotizacion solo en browser");
  try {
    return await apiFetch<Local.Cotizacion>(API, { method: "POST", json: data });
  } catch {
    return Local.createCotizacion(data as any);
  }
}

export async function updateCotizacion(id: string, patch: Partial<Local.Cotizacion>) {
  if (!hasWindow()) throw new Error("updateCotizacion solo en browser");
  try {
    return await apiFetch<Local.Cotizacion>(${API}/, { method: "PATCH", json: patch });
  } catch {
    return Local.updateCotizacion(id, patch as any);
  }
}

export async function deleteCotizacion(id: string) {
  if (!hasWindow()) throw new Error("deleteCotizacion solo en browser");
  try {
    await apiFetch(${API}/, { method: "DELETE" });
  } catch {
    Local.deleteCotizacion(id);
  }
}

export async function createVersionFrom(id: string) {
  if (!hasWindow()) throw new Error("createVersionFrom solo en browser");
  try {
    return await apiFetch<Local.Cotizacion>(${API}//versionar, { method: "POST" });
  } catch {
    return Local.createVersionFrom(id);
  }
}

/* Plantillas */
const API_TPL = "/api/cotizaciones/plantillas";

export async function listPlantillas(search = "") {
  if (!hasWindow()) return [] as Local.PlantillaTexto[];
  try {
    return await apiFetch<Local.PlantillaTexto[]>(${API_TPL}?q=);
  } catch {
    return Local.listPlantillas(search);
  }
}

export async function getPlantilla(id: string) {
  if (!hasWindow()) return null as Local.PlantillaTexto | null;
  try {
    return await apiFetch<Local.PlantillaTexto>(${API_TPL}/);
  } catch {
    return Local.getPlantilla(id);
  }
}

export async function createPlantilla(data: Pick<Local.PlantillaTexto, "nombre" | "cuerpo" | "activo">) {
  if (!hasWindow()) throw new Error("createPlantilla solo en browser");
  try {
    return await apiFetch<Local.PlantillaTexto>(API_TPL, { method: "POST", json: data });
  } catch {
    return Local.createPlantilla(data as any);
  }
}

export async function updatePlantilla(id: string, patch: Partial<Local.PlantillaTexto>) {
  if (!hasWindow()) throw new Error("updatePlantilla solo en browser");
  try {
    return await apiFetch<Local.PlantillaTexto>(${API_TPL}/, { method: "PATCH", json: patch });
  } catch {
    return Local.updatePlantilla(id, patch as any);
  }
}

export async function deletePlantilla(id: string) {
  if (!hasWindow()) throw new Error("deletePlantilla solo en browser");
  try {
    await apiFetch(${API_TPL}/, { method: "DELETE" });
  } catch {
    Local.deletePlantilla(id);
  }
}
