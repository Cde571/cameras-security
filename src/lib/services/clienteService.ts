import * as Local from "./clienteLocalService";

export type Cliente = Local.Cliente;

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

const API = "/api/clientes";

export async function listClientes(search = ""): Promise<Cliente[]> {
  if (!hasWindow()) return [];
  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    const data = await apiFetch<any>(`${API}${q}`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;

    return [];
  } catch (error) {
    console.warn("[clienteService] fallback listClientes:", error);
    return Local.listClientes(search);
  }
}

export async function getCliente(id: string): Promise<Cliente | null> {
  if (!hasWindow()) return null;

  try {
    const data = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`);

    if (!data) return null;
    if (data?.item) return data.item;
    return data;
  } catch (error) {
    console.warn("[clienteService] fallback getCliente:", error);
    return Local.getCliente(id);
  }
}

export async function createCliente(data: Omit<Cliente, "id" | "createdAt" | "updatedAt">): Promise<Cliente> {
  if (!hasWindow()) throw new Error("createCliente solo en browser");

  try {
    const result = await apiFetch<any>(API, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return result?.item ?? result;
  } catch (error) {
    console.warn("[clienteService] fallback createCliente:", error);
    return Local.createCliente(data as any);
  }
}

export async function updateCliente(id: string, patch: Partial<Cliente>): Promise<Cliente> {
  if (!hasWindow()) throw new Error("updateCliente solo en browser");

  try {
    const result = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });

    return result?.item ?? result;
  } catch (error) {
    console.warn("[clienteService] fallback updateCliente:", error);
    return Local.updateCliente(id, patch as any);
  }
}

export async function deleteCliente(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deleteCliente solo en browser");

  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("[clienteService] fallback deleteCliente:", error);
    Local.deleteCliente(id);
  }
}