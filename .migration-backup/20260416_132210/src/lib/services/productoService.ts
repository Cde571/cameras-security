import * as Local from "./productoLocalService";

type Producto = any;

type ProductoMeta = {
  categorias: string[];
  marcas: string[];
  total: number;
  activos: number;
  inactivos: number;
};

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

const API = "/api/productos";

function applyFilters(productos: Producto[], filters?: any) {
  const categoria = String(filters?.categoria ?? "").trim().toLowerCase();
  const marca = String(filters?.marca ?? "").trim().toLowerCase();
  const activo = String(filters?.activo ?? "all").trim().toLowerCase();

  return (Array.isArray(productos) ? productos : []).filter((p) => {
    const okCategoria = !categoria || String(p?.categoria ?? "").toLowerCase() === categoria;
    const okMarca = !marca || String(p?.marca ?? "").toLowerCase() === marca;

    const pActivo = Boolean(p?.activo ?? (String(p?.estado ?? "activo").toLowerCase() !== "inactivo"));
    const okActivo =
      activo === "all" ? true :
      activo === "active" ? pActivo :
      activo === "inactive" ? !pActivo :
      true;

    return okCategoria && okMarca && okActivo;
  });
}

export async function listProductos(search = "", filters: any = {}): Promise<Producto[]> {
  if (!hasWindow()) return [];

  try {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    const data = await apiFetch<any>(`${API}${q}`);

    let items: Producto[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.items)) items = data.items;

    return applyFilters(items, filters);
  } catch (error) {
    console.warn("[productoService] fallback listProductos:", error);

    const localItems =
      typeof Local.listProductos === "function"
        ? Local.listProductos(search)
        : [];

    return applyFilters(localItems, filters);
  }
}

export async function getProducto(id: string): Promise<Producto | null> {
  if (!hasWindow()) return null;

  try {
    const data = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`);
    if (!data) return null;
    if (data?.item) return data.item;
    return data;
  } catch (error) {
    console.warn("[productoService] fallback getProducto:", error);
    return typeof Local.getProducto === "function" ? Local.getProducto(id) : null;
  }
}

export async function createProducto(data: any): Promise<Producto> {
  if (!hasWindow()) throw new Error("createProducto solo en browser");

  try {
    const result = await apiFetch<any>(API, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return result?.item ?? result;
  } catch (error) {
    console.warn("[productoService] fallback createProducto:", error);
    return typeof Local.createProducto === "function" ? Local.createProducto(data) : data;
  }
}

export async function updateProducto(id: string, patch: any): Promise<Producto> {
  if (!hasWindow()) throw new Error("updateProducto solo en browser");

  try {
    const result = await apiFetch<any>(`${API}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });

    return result?.item ?? result;
  } catch (error) {
    console.warn("[productoService] fallback updateProducto:", error);
    return typeof Local.updateProducto === "function" ? Local.updateProducto(id, patch) : patch;
  }
}

export async function deleteProducto(id: string): Promise<void> {
  if (!hasWindow()) throw new Error("deleteProducto solo en browser");

  try {
    await apiFetch(`${API}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn("[productoService] fallback deleteProducto:", error);
    if (typeof Local.deleteProducto === "function") {
      Local.deleteProducto(id);
    }
  }
}

export async function getProductoMeta(): Promise<ProductoMeta> {
  if (!hasWindow()) {
    return {
      categorias: [],
      marcas: [],
      total: 0,
      activos: 0,
      inactivos: 0,
    };
  }

  try {
    const data = await apiFetch<any>(`${API}/meta`);
    if (data?.item) return data.item;
    return data;
  } catch (error) {
    console.warn("[productoService] fallback getProductoMeta:", error);

    const localItems =
      typeof Local.listProductos === "function"
        ? Local.listProductos("")
        : [];

    const categorias = [...new Set(localItems.map((x: any) => x?.categoria).filter(Boolean))].sort();
    const marcas = [...new Set(localItems.map((x: any) => x?.marca).filter(Boolean))].sort();
    const total = localItems.length;
    const activos = localItems.filter((x: any) => x?.activo !== false && x?.estado !== "inactivo").length;
    const inactivos = total - activos;

    return { categorias, marcas, total, activos, inactivos };
  }
}


export const listProducts = listProductos;
export const getProduct = getProducto;
export const createProduct = createProducto;
export const updateProduct = updateProducto;
export const deleteProduct = deleteProducto;
export const getProductsMeta = getProductoMeta;

export const productoService = {
  listProductos,
  listProducts,
  getProducto,
  getProduct,
  createProducto,
  createProduct,
  updateProducto,
  updateProduct,
  deleteProducto,
  deleteProduct,
  getProductoMeta,
  getProductsMeta,
};
