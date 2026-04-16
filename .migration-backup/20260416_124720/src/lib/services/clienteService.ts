import { apiRequest, isDemoMode } from "./httpClient";
import * as Local from "./clienteLocalService";

export async function listarClientes(q = "") {
  try {
    if (isDemoMode() && typeof Local.listClientes === "function") {
      return Local.listClientes(q);
    }

    const url = q ? `/api/clientes?q=${encodeURIComponent(q)}` : "/api/clientes";
    const data = await apiRequest(url);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.warn("[clienteService] fallback local listarClientes:", error);
    return typeof Local.listClientes === "function" ? Local.listClientes(q) : [];
  }
}

export async function obtenerCliente(id: string) {
  try {
    if (isDemoMode() && typeof Local.getCliente === "function") {
      return Local.getCliente(id);
    }

    const data = await apiRequest(`/api/clientes/${encodeURIComponent(id)}`);
    return data?.item ?? null;
  } catch (error) {
    console.warn("[clienteService] fallback local obtenerCliente:", error);
    return typeof Local.getCliente === "function" ? Local.getCliente(id) : null;
  }
}

export async function crearCliente(payload: any) {
  try {
    if (isDemoMode() && typeof Local.createCliente === "function") {
      return Local.createCliente(payload);
    }

    const data = await apiRequest("/api/clientes", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[clienteService] fallback local crearCliente:", error);
    return typeof Local.createCliente === "function" ? Local.createCliente(payload) : payload;
  }
}

export async function actualizarCliente(id: string, payload: any) {
  try {
    if (isDemoMode() && typeof Local.updateCliente === "function") {
      return Local.updateCliente(id, payload);
    }

    const data = await apiRequest(`/api/clientes/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[clienteService] fallback local actualizarCliente:", error);
    return typeof Local.updateCliente === "function" ? Local.updateCliente(id, payload) : payload;
  }
}

export async function eliminarCliente(id: string) {
  try {
    if (isDemoMode() && typeof Local.deleteCliente === "function") {
      return Local.deleteCliente(id);
    }

    await apiRequest(`/api/clientes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("[clienteService] fallback local eliminarCliente:", error);
    if (typeof Local.deleteCliente === "function") {
      return Local.deleteCliente(id);
    }
  }
}

export const listClientes = listarClientes;
export const getCliente = obtenerCliente;
export const createCliente = crearCliente;
export const updateCliente = actualizarCliente;
export const deleteCliente = eliminarCliente;

export const clienteService = {
  listarClientes,
  listClientes,
  obtenerCliente,
  getCliente,
  crearCliente,
  createCliente,
  actualizarCliente,
  updateCliente,
  eliminarCliente,
  deleteCliente,
};