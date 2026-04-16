import * as Local from "./ordenLocalService";

type Orden = any;
type ChecklistTemplate = any;

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

function normalizeOrden(raw: any) {
  if (!raw) return null;

  return {
    ...raw,
    cliente: raw?.cliente ?? (raw?.clienteNombre ? { nombre: raw.clienteNombre, ciudad: raw?.clienteCiudad } : null),
    fechaProgramada: raw?.fechaProgramada ?? raw?.fecha_programada ?? null,
    direccionServicio: raw?.direccionServicio ?? raw?.direccion_servicio ?? null,
    tecnicoId: raw?.tecnicoId ?? raw?.tecnico_id ?? null,
    checklist: Array.isArray(raw?.checklist) ? raw.checklist : [],
    evidencias: Array.isArray(raw?.evidencias) ? raw.evidencias : [],
    createdAt: raw?.createdAt ?? raw?.created_at ?? null,
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? null,
  };
}

export async function listOrdenes(search = ""): Promise<Orden[]> {
  if (!hasWindow()) return [];

  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    const data = await apiFetch<any>(`/api/ordenes${q}`);

    let items: Orden[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.items)) items = data.items;
    else if (Array.isArray(data?.list)) items = data.list;

    return items.map(normalizeOrden).filter(Boolean);
  } catch (error) {
    console.warn("[ordenService] fallback listOrdenes:", error);

    const localItems =
      typeof (Local as any).listOrdenes === "function"
        ? (Local as any).listOrdenes(search)
        : [];

    return (Array.isArray(localItems) ? localItems : []).map(normalizeOrden).filter(Boolean);
  }
}

export async function getOrden(id: string): Promise<Orden | null> {
  if (!hasWindow()) return null;

  try {
    const data = await apiFetch<any>(`/api/ordenes/${encodeURIComponent(id)}`);

    if (!data) return null;
    if (data?.item) return normalizeOrden(data.item);
    return normalizeOrden(data);
  } catch (error) {
    console.warn("[ordenService] fallback getOrden:", error);

    return typeof (Local as any).getOrden === "function"
      ? normalizeOrden((Local as any).getOrden(id))
      : null;
  }
}

export async function createOrden(data: any): Promise<Orden> {
  if (!hasWindow()) throw new Error("createOrden solo en browser");

  try {
    const result = await apiFetch<any>("/api/ordenes", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return normalizeOrden(result?.item ?? result);
  } catch (error) {
    console.warn("[ordenService] fallback createOrden:", error);

    return typeof (Local as any).createOrden === "function"
      ? normalizeOrden((Local as any).createOrden(data))
      : data;
  }
}

export async function updateOrden(id: string, patch: any): Promise<Orden> {
  if (!hasWindow()) throw new Error("updateOrden solo en browser");

  try {
    const result = await apiFetch<any>(`/api/ordenes/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });

    return normalizeOrden(result?.item ?? result);
  } catch (error) {
    console.warn("[ordenService] fallback updateOrden:", error);

    return typeof (Local as any).updateOrden === "function"
      ? normalizeOrden((Local as any).updateOrden(id, patch))
      : patch;
  }
}

export async function deleteOrden(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deleteOrden solo en browser");

  try {
    await apiFetch(`/api/ordenes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("[ordenService] fallback deleteOrden:", error);

    if (typeof (Local as any).deleteOrden === "function") {
      (Local as any).deleteOrden(id);
    }
  }
}

export async function listCheckListTemplates(search = ""): Promise<ChecklistTemplate[]> {
  if (!hasWindow()) return [];

  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    const data = await apiFetch<any>(`/api/ordenes/checklist-templates${q}`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  } catch (error) {
    console.warn("[ordenService] fallback listCheckListTemplates:", error);

    if (typeof (Local as any).listCheckListTemplates === "function") {
      return (Local as any).listCheckListTemplates(search);
    }

    return [];
  }
}

export const listWorkOrders = listOrdenes;
export const getWorkOrder = getOrden;
export const createWorkOrder = createOrden;
export const updateWorkOrder = updateOrden;
export const deleteWorkOrder = deleteOrden;
export const getChecklistTemplates = listCheckListTemplates;

export const ordenService = {
  listOrdenes,
  listWorkOrders,
  getOrden,
  getWorkOrder,
  createOrden,
  createWorkOrder,
  updateOrden,
  updateWorkOrder,
  deleteOrden,
  deleteWorkOrder,
  listCheckListTemplates,
  getChecklistTemplates,
};