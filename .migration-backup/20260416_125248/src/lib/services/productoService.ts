import { apiRequest, isDemoMode } from "./httpClient";
import * as Local from "./productoLocalService";

export async function listarProductos(q = "") {
  try {
    if (isDemoMode() && typeof Local.listProductos === "function") {
      return Local.listProductos(q);
    }

    const url = q ? `/api/productos?q=${encodeURIComponent(q)}` : "/api/productos";
    const data = await apiRequest(url);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    console.warn("[productoService] fallback local listarProductos:", error);
    return typeof Local.listProductos === "function" ? Local.listProductos(q) : [];
  }
}

export async function obtenerProducto(id: string) {
  try {
    if (isDemoMode() && typeof Local.getProducto === "function") {
      return Local.getProducto(id);
    }

    const data = await apiRequest(`/api/productos/${encodeURIComponent(id)}`);
    return data?.item ?? null;
  } catch (error) {
    console.warn("[productoService] fallback local obtenerProducto:", error);
    return typeof Local.getProducto === "function" ? Local.getProducto(id) : null;
  }
}

export async function crearProducto(payload: any) {
  try {
    if (isDemoMode() && typeof Local.createProducto === "function") {
      return Local.createProducto(payload);
    }

    const data = await apiRequest("/api/productos", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[productoService] fallback local crearProducto:", error);
    return typeof Local.createProducto === "function" ? Local.createProducto(payload) : payload;
  }
}

export async function actualizarProducto(id: string, payload: any) {
  try {
    if (isDemoMode() && typeof Local.updateProducto === "function") {
      return Local.updateProducto(id, payload);
    }

    const data = await apiRequest(`/api/productos/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    return data?.item ?? null;
  } catch (error) {
    console.warn("[productoService] fallback local actualizarProducto:", error);
    return typeof Local.updateProducto === "function" ? Local.updateProducto(id, payload) : payload;
  }
}

export async function eliminarProducto(id: string) {
  try {
    if (isDemoMode() && typeof Local.deleteProducto === "function") {
      return Local.deleteProducto(id);
    }

    await apiRequest(`/api/productos/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("[productoService] fallback local eliminarProducto:", error);
    if (typeof Local.deleteProducto === "function") {
      return Local.deleteProducto(id);
    }
  }
}

export const listProductos = listarProductos;
export const getProducto = obtenerProducto;
export const createProducto = crearProducto;
export const updateProducto = actualizarProducto;
export const deleteProducto = eliminarProducto;

export const productoService = {
  listarProductos,
  listProductos,
  obtenerProducto,
  getProducto,
  crearProducto,
  createProducto,
  actualizarProducto,
  updateProducto,
  eliminarProducto,
  deleteProducto,
};