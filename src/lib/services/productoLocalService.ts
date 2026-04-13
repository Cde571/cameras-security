export type Producto = {
  id: string;
  nombre: string;
  sku?: string;
  categoria?: string;
  marca?: string;
  unidad?: string;         // ej: "unidad", "metro", "paquete"
  costo?: number;          // costo compra
  precio?: number;         // precio venta antes de IVA (si aplica)
  ivaPct?: number;         // 0, 5, 19...
  activo?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductoMeta = {
  categorias: string[];
  marcas: string[];
};

export type KitItem = { productId: string; qty: number };

export type Kit = {
  id: string;
  nombre: string;
  descripcion?: string;
  items: KitItem[];
  descuentoPct?: number;   // aplica sobre subtotal (0-100)
  precioFijo?: number;     // si se define, ignora subtotal/descuento
  activo?: boolean;
  createdAt: string;
  updatedAt: string;
};

const KEY_PRODUCTS = "coti_productos_v1";
const KEY_META = "coti_productos_meta_v1";
const KEY_KITS = "coti_kits_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try { return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; }
}

function uid(prefix: string) {
  return (globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

function seedMetaIfEmpty() {
  if (typeof window === "undefined") return;
  const meta = safeParse<ProductoMeta | null>(localStorage.getItem(KEY_META), null);
  if (meta) return;

  const seed: ProductoMeta = {
    categorias: ["Cámaras", "Grabadores (DVR/NVR)", "Accesorios", "Redes", "Servicios"],
    marcas: ["Hikvision", "Dahua", "TP-Link", "Ubiquiti", "Genérico"],
  };
  localStorage.setItem(KEY_META, JSON.stringify(seed));
}

function seedProductsIfEmpty() {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();

  const list = safeParse<Producto[]>(localStorage.getItem(KEY_PRODUCTS), []);
  if (list.length > 0) return;

  const now = new Date().toISOString();
  const seed: Producto[] = [
    {
      id: uid("prd"),
      nombre: "Cámara IP 4MP (ColorVu)",
      sku: "CAM-IP-4MP-01",
      categoria: "Cámaras",
      marca: "Hikvision",
      unidad: "unidad",
      costo: 180000,
      precio: 260000,
      ivaPct: 19,
      activo: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid("prd"),
      nombre: "NVR 8 Canales PoE",
      sku: "NVR-8-POE-01",
      categoria: "Grabadores (DVR/NVR)",
      marca: "Dahua",
      unidad: "unidad",
      costo: 650000,
      precio: 900000,
      ivaPct: 19,
      activo: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid("prd"),
      nombre: "Cable UTP Cat6 (metro)",
      sku: "UTP-CAT6-M",
      categoria: "Accesorios",
      marca: "Genérico",
      unidad: "metro",
      costo: 1200,
      precio: 2200,
      ivaPct: 19,
      activo: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(seed));
}

function seedKitsIfEmpty() {
  if (typeof window === "undefined") return;
  seedProductsIfEmpty();

  const kits = safeParse<Kit[]>(localStorage.getItem(KEY_KITS), []);
  if (kits.length > 0) return;

  const prods = safeParse<Producto[]>(localStorage.getItem(KEY_PRODUCTS), []);
  const cam = prods.find(p => p.sku === "CAM-IP-4MP-01")?.id;
  const nvr = prods.find(p => p.sku === "NVR-8-POE-01")?.id;

  const now = new Date().toISOString();
  const seed: Kit[] = [
    {
      id: uid("kit"),
      nombre: "Kit Básico 2 Cámaras + NVR",
      descripcion: "Ideal para negocio pequeño.",
      items: [
        ...(cam ? [{ productId: cam, qty: 2 }] : []),
        ...(nvr ? [{ productId: nvr, qty: 1 }] : []),
      ],
      descuentoPct: 5,
      activo: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
  localStorage.setItem(KEY_KITS, JSON.stringify(seed));
}

/* =========================
   Productos
========================= */
export function listProductos(search = "", filters?: { categoria?: string; marca?: string; activo?: "all" | "active" | "inactive" }): Producto[] {
  if (typeof window === "undefined") return [];
  seedProductsIfEmpty();

  const list = safeParse<Producto[]>(localStorage.getItem(KEY_PRODUCTS), []);
  const q = search.trim().toLowerCase();
  const cat = filters?.categoria?.trim() || "";
  const mar = filters?.marca?.trim() || "";
  const act = filters?.activo || "all";

  return list
    .filter(p => {
      if (act === "active" && p.activo === false) return false;
      if (act === "inactive" && p.activo !== false) return false;
      if (cat && (p.categoria || "") !== cat) return false;
      if (mar && (p.marca || "") !== mar) return false;
      if (!q) return true;

      const blob = [p.nombre, p.sku, p.categoria, p.marca, p.unidad].filter(Boolean).join(" ").toLowerCase();
      return blob.includes(q);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProducto(id: string): Producto | null {
  if (typeof window === "undefined") return null;
  seedProductsIfEmpty();
  const list = safeParse<Producto[]>(localStorage.getItem(KEY_PRODUCTS), []);
  return list.find(p => p.id === id) ?? null;
}

export function createProducto(data: Omit<Producto, "id" | "createdAt" | "updatedAt">): Producto {
  if (typeof window === "undefined") throw new Error("createProducto debe ejecutarse en el browser");
  seedProductsIfEmpty();

  const now = new Date().toISOString();
  const nuevo: Producto = {
    id: uid("prd"),
    createdAt: now,
    updatedAt: now,
    activo: data.activo ?? true,
    ...data,
  };

  const list = safeParse<Producto[]>(localStorage.getItem(KEY_PRODUCTS), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list));
  return nuevo;
}

export function updateProducto(id: string, patch: Partial<Producto>): Producto {
  if (typeof window === "undefined") throw new Error("updateProducto debe ejecutarse en el browser");
  seedProductsIfEmpty();

  const list = safeParse<Producto[]>(localStorage.getItem(KEY_PRODUCTS), []);
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) throw new Error("Producto no existe");

  const updated: Producto = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list));
  return updated;
}

export function deleteProducto(id: string) {
  if (typeof window === "undefined") throw new Error("deleteProducto debe ejecutarse en el browser");
  seedProductsIfEmpty();
  const list = safeParse<Producto[]>(localStorage.getItem(KEY_PRODUCTS), []);
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list.filter(p => p.id !== id)));
}

/* =========================
   Meta: Categorías / Marcas
========================= */
export function getProductoMeta(): ProductoMeta {
  if (typeof window === "undefined") return { categorias: [], marcas: [] };
  seedMetaIfEmpty();
  return safeParse<ProductoMeta>(localStorage.getItem(KEY_META), { categorias: [], marcas: [] });
}

function setMeta(meta: ProductoMeta) {
  localStorage.setItem(KEY_META, JSON.stringify(meta));
}

export function addCategoria(nombre: string) {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const meta = getProductoMeta();
  const n = nombre.trim();
  if (!n) return;
  if (meta.categorias.some(c => c.toLowerCase() === n.toLowerCase())) return;
  meta.categorias.push(n);
  meta.categorias.sort((a, b) => a.localeCompare(b));
  setMeta(meta);
}

export function removeCategoria(nombre: string) {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const meta = getProductoMeta();
  meta.categorias = meta.categorias.filter(c => c !== nombre);
  setMeta(meta);
}

export function addMarca(nombre: string) {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const meta = getProductoMeta();
  const n = nombre.trim();
  if (!n) return;
  if (meta.marcas.some(m => m.toLowerCase() === n.toLowerCase())) return;
  meta.marcas.push(n);
  meta.marcas.sort((a, b) => a.localeCompare(b));
  setMeta(meta);
}

export function removeMarca(nombre: string) {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const meta = getProductoMeta();
  meta.marcas = meta.marcas.filter(m => m !== nombre);
  setMeta(meta);
}

/* =========================
   Kits / Combos
========================= */
export function listKits(search = ""): Kit[] {
  if (typeof window === "undefined") return [];
  seedKitsIfEmpty();
  const list = safeParse<Kit[]>(localStorage.getItem(KEY_KITS), []);
  const q = search.trim().toLowerCase();

  return list
    .filter(k => {
      if (!q) return true;
      return [k.nombre, k.descripcion].filter(Boolean).join(" ").toLowerCase().includes(q);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getKit(id: string): Kit | null {
  if (typeof window === "undefined") return null;
  seedKitsIfEmpty();
  const list = safeParse<Kit[]>(localStorage.getItem(KEY_KITS), []);
  return list.find(k => k.id === id) ?? null;
}

export function createKit(data: Omit<Kit, "id" | "createdAt" | "updatedAt">): Kit {
  if (typeof window === "undefined") throw new Error("createKit debe ejecutarse en el browser");
  seedKitsIfEmpty();

  const now = new Date().toISOString();
  const nuevo: Kit = {
    id: uid("kit"),
    createdAt: now,
    updatedAt: now,
    activo: data.activo ?? true,
    ...data,
  };

  const list = safeParse<Kit[]>(localStorage.getItem(KEY_KITS), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_KITS, JSON.stringify(list));
  return nuevo;
}

export function updateKit(id: string, patch: Partial<Kit>): Kit {
  if (typeof window === "undefined") throw new Error("updateKit debe ejecutarse en el browser");
  seedKitsIfEmpty();

  const list = safeParse<Kit[]>(localStorage.getItem(KEY_KITS), []);
  const idx = list.findIndex(k => k.id === id);
  if (idx === -1) throw new Error("Kit no existe");

  const updated: Kit = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  localStorage.setItem(KEY_KITS, JSON.stringify(list));
  return updated;
}

export function deleteKit(id: string) {
  if (typeof window === "undefined") throw new Error("deleteKit debe ejecutarse en el browser");
  seedKitsIfEmpty();
  const list = safeParse<Kit[]>(localStorage.getItem(KEY_KITS), []);
  localStorage.setItem(KEY_KITS, JSON.stringify(list.filter(k => k.id !== id)));
}

/* =========================
   Helpers para totales
========================= */
export function calcProductoTotal(p: Producto, qty: number) {
  const precio = Number(p.precio || 0);
  const iva = Number(p.ivaPct || 0) / 100;
  const subtotal = precio * qty;
  const ivaValue = subtotal * iva;
  const total = subtotal + ivaValue;
  return { subtotal, ivaValue, total };
}

export function calcKitTotal(kit: Kit) {
  const prods = safeParse<Producto[]>(localStorage.getItem(KEY_PRODUCTS), []);
  let subtotal = 0;

  for (const it of kit.items) {
    const p = prods.find(pp => pp.id === it.productId);
    if (!p) continue;
    subtotal += Number(p.precio || 0) * Number(it.qty || 0);
  }

  let total = subtotal;
  if (typeof kit.precioFijo === "number" && kit.precioFijo >= 0) {
    total = kit.precioFijo;
  } else if (kit.descuentoPct) {
    total = subtotal * (1 - Number(kit.descuentoPct) / 100);
  }

  return { subtotal, total };
}
