import * as Local from "./cotizacionLocalService";

type Cotizacion = any;

function hasWindow() {
  return typeof window !== "undefined";
}

async function apiFetch<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
    ...opts,
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  }

  return data as T;
}

const API = "/api/cotizaciones";

function normalizeCotizacion(raw: any) {
  if (!raw) return null;

  return {
    ...raw,
    cliente: raw?.cliente ?? (raw?.clienteNombre ? { nombre: raw.clienteNombre } : null),
    vigenciaDias: raw?.vigenciaDias ?? raw?.vigencia_dias ?? 30,
    createdAt: raw?.createdAt ?? raw?.created_at ?? null,
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? null,
  };
}

export async function listCotizaciones(search = ""): Promise<Cotizacion[]> {
  if (!hasWindow()) return [];

  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    const data = await apiFetch<any>(`${API}${q}`);

    let items: Cotizacion[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.items)) items = data.items;
    else if (Array.isArray(data?.list)) items = data.list;

    return items.map(normalizeCotizacion).filter(Boolean);
  } catch (error) {
    console.warn("[cotizacionService] fallback listCotizaciones:", error);

    const localItems =
      typeof Local.listCotizaciones === "function"
        ? Local.listCotizaciones(search)
        : [];

    return (Array.isArray(localItems) ? localItems : []).map(normalizeCotizacion).filter(Boolean);
  }
}

export async function getCotizacion(id: string): Promise<Cotizacion | null> {
  if (!hasWindow()) return null;

  try {
    const data = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`);

    if (!data) return null;
    if (data?.item) return normalizeCotizacion(data.item);
    return normalizeCotizacion(data);
  } catch (error) {
    console.warn("[cotizacionService] fallback getCotizacion:", error);

    return typeof Local.getCotizacion === "function"
      ? normalizeCotizacion(Local.getCotizacion(id))
      : null;
  }
}

export async function createCotizacion(data: any): Promise<Cotizacion> {
  if (!hasWindow()) throw new Error("createCotizacion solo en browser");

  try {
    const result = await apiFetch<any>(API, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return normalizeCotizacion(result?.item ?? result);
  } catch (error) {
    console.warn("[cotizacionService] fallback createCotizacion:", error);

    return typeof Local.createCotizacion === "function"
      ? normalizeCotizacion(Local.createCotizacion(data))
      : data;
  }
}

export async function updateCotizacion(id: string, patch: any): Promise<Cotizacion> {
  if (!hasWindow()) throw new Error("updateCotizacion solo en browser");

  try {
    const result = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });

    return normalizeCotizacion(result?.item ?? result);
  } catch (error) {
    console.warn("[cotizacionService] fallback updateCotizacion:", error);

    return typeof Local.updateCotizacion === "function"
      ? normalizeCotizacion(Local.updateCotizacion(id, patch))
      : patch;
  }
}

export async function deleteCotizacion(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deleteCotizacion solo en browser");

  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("[cotizacionService] fallback deleteCotizacion:", error);

    if (typeof Local.deleteCotizacion === "function") {
      Local.deleteCotizacion(id);
    }
  }
}

export const listQuotations = listCotizaciones;
export const getQuotation = getCotizacion;
export const createQuotation = createCotizacion;
export const updateQuotation = updateCotizacion;
export const deleteQuotation = deleteCotizacion;

export const cotizacionService = {
  listCotizaciones,
  listQuotations,
  getCotizacion,
  getQuotation,
  createCotizacion,
  createQuotation,
  updateCotizacion,
  updateQuotation,
  deleteCotizacion,
  deleteQuotation,
};