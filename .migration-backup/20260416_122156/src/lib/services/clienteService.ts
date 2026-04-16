import type { Cliente } from "./clienteLocalService";
import * as Local from "./clienteLocalService";

type ClientePayload = Partial<Cliente> & {
  nombre?: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  notas?: string;
  estado?: string;
};

const API = "/api/clientes";

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

function normalizeCliente(raw: any): Cliente {
  return {
    id: String(raw?.id ?? ""),
    nombre: String(raw?.nombre ?? ""),
    documento: raw?.documento ?? "",
    telefono: raw?.telefono ?? "",
    email: raw?.email ?? "",
    direccion: raw?.direccion ?? "",
    ciudad: raw?.ciudad ?? "",
    notas: raw?.notas ?? "",
    estado: raw?.estado ?? "activo",
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? new Date().toISOString(),
  };
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
    throw new Error(data?.error || data?.message || `Error HTTP ${response.status}`);
  }

  return data;
}

export async function listarClientes(q = ""): Promise<Cliente[]> {
  try {
    if (isDemoMode()) return Local.listClientes(q);

    const url = q ? `${API}?q=${encodeURIComponent(q)}` : API;
    const data = await request(url);

    if (Array.isArray(data)) return data.map(normalizeCliente);
    if (Array.isArray(data?.items)) return data.items.map(normalizeCliente);

    return [];
  } catch (error) {
    console.warn("[clienteService] fallback local listarClientes:", error);
    return Local.listClientes(q);
  }
}

export async function obtenerCliente(id: string): Promise<Cliente | null> {
  try {
    if (isDemoMode()) return Local.getCliente(id);

    const data = await request(`${API}/${encodeURIComponent(id)}`);

    if (!data) return null;
    if (data?.item) return normalizeCliente(data.item);
    return normalizeCliente(data);
  } catch (error) {
    console.warn("[clienteService] fallback local obtenerCliente:", error);
    return Local.getCliente(id);
  }
}

export async function crearCliente(payload: ClientePayload): Promise<Cliente> {
  try {
    if (isDemoMode()) return Local.createCliente(payload as any);

    const data = await request(API, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return normalizeCliente(data?.item ?? data);
  } catch (error) {
    console.warn("[clienteService] fallback local crearCliente:", error);
    return Local.createCliente(payload as any);
  }
}

export async function actualizarCliente(id: string, payload: ClientePayload): Promise<Cliente> {
  try {
    if (isDemoMode()) return Local.updateCliente(id, payload as any);

    const data = await request(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    return normalizeCliente(data?.item ?? data);
  } catch (error) {
    console.warn("[clienteService] fallback local actualizarCliente:", error);
    return Local.updateCliente(id, payload as any);
  }
}

export async function eliminarCliente(id: string): Promise<void> {
  try {
    if (isDemoMode()) {
      Local.deleteCliente(id);
      return;
    }

    const response = await fetch(`${API}/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok && response.status !== 204) {
      const data = await parseJsonSafe(response);
      throw new Error(data?.error || "No fue posible eliminar el cliente");
    }
  } catch (error) {
    console.warn("[clienteService] fallback local eliminarCliente:", error);
    Local.deleteCliente(id);
  }
}

/* aliases compatibles con código viejo */
export const listClientes = listarClientes;
export const getCliente = obtenerCliente;
export const createCliente = crearCliente;
export const updateCliente = actualizarCliente;
export const deleteCliente = eliminarCliente;

export const clienteService = {
  listar: listarClientes,
  listarClientes,
  listClientes,
  obtenerPorId: obtenerCliente,
  obtenerCliente,
  getCliente,
  crear: crearCliente,
  crearCliente,
  createCliente,
  actualizar: actualizarCliente,
  actualizarCliente,
  updateCliente,
  eliminar: eliminarCliente,
  eliminarCliente,
  deleteCliente,
};