import * as Local from "./actaLocalService";

type Acta = any;

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

function normalizeActa(raw: any) {
  if (!raw) return null;

  return {
    ...raw,
    cliente: raw?.cliente ?? null,
    fecha: raw?.fecha ?? null,
    lugar: raw?.lugar ?? null,
    status: raw?.status ?? raw?.estado ?? "borrador",
    firmaDataUrl: raw?.firmaDataUrl ?? raw?.firma_data_url ?? "",
    createdAt: raw?.createdAt ?? raw?.created_at ?? null,
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? null,
  };
}

export async function listActas(search = ""): Promise<Acta[]> {
  if (!hasWindow()) return [];

  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    const data = await apiFetch<any>(`/api/actas${q}`);

    let items: Acta[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.items)) items = data.items;
    else if (Array.isArray(data?.list)) items = data.list;

    return items.map(normalizeActa).filter(Boolean);
  } catch (error) {
    console.warn("[actaService] fallback listActas:", error);

    const localItems =
      typeof (Local as any).listActas === "function"
        ? (Local as any).listActas(search)
        : [];

    return (Array.isArray(localItems) ? localItems : []).map(normalizeActa).filter(Boolean);
  }
}

export async function getActa(id: string): Promise<Acta | null> {
  if (!hasWindow()) return null;

  try {
    const data = await apiFetch<any>(`/api/actas/${encodeURIComponent(id)}`);
    if (!data) return null;
    if (data?.item) return normalizeActa(data.item);
    return normalizeActa(data);
  } catch (error) {
    console.warn("[actaService] fallback getActa:", error);

    return typeof (Local as any).getActa === "function"
      ? normalizeActa((Local as any).getActa(id))
      : null;
  }
}

export async function createActa(data: any): Promise<Acta> {
  if (!hasWindow()) throw new Error("createActa solo en browser");

  const result = await apiFetch<any>("/api/actas", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return normalizeActa(result?.item ?? result);
}

export async function updateActa(id: string, patch: any): Promise<Acta> {
  if (!hasWindow()) throw new Error("updateActa solo en browser");

  const result = await apiFetch<any>(`/api/actas/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

  return normalizeActa(result?.item ?? result);
}

export async function deleteActa(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deleteActa solo en browser");

  await apiFetch(`/api/actas/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export const listDeliveryRecords = listActas;
export const getDeliveryRecord = getActa;
export const createDeliveryRecord = createActa;
export const updateDeliveryRecord = updateActa;
export const deleteDeliveryRecord = deleteActa;

export const actaService = {
  listActas,
  listDeliveryRecords,
  getActa,
  getDeliveryRecord,
  createActa,
  createDeliveryRecord,
  updateActa,
  updateDeliveryRecord,
  deleteActa,
  deleteDeliveryRecord,
};