const KEY_PRODUCTS = "coti_productos_v1";
const KEY_META = "coti_productos_meta_v1";
const KEY_KITS = "coti_kits_v1";
function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function uid(prefix) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function seedMetaIfEmpty() {
  if (typeof window === "undefined") return;
  const meta = safeParse(localStorage.getItem(KEY_META), null);
  if (meta) return;
  const seed = {
    categorias: ["Cámaras", "Grabadores (DVR/NVR)", "Accesorios", "Redes", "Servicios"],
    marcas: ["Hikvision", "Dahua", "TP-Link", "Ubiquiti", "Genérico"]
  };
  localStorage.setItem(KEY_META, JSON.stringify(seed));
}
function seedProductsIfEmpty() {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_PRODUCTS), []);
  if (list.length > 0) return;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const seed = [
    {
      id: uid("prd"),
      nombre: "Cámara IP 4MP (ColorVu)",
      sku: "CAM-IP-4MP-01",
      categoria: "Cámaras",
      marca: "Hikvision",
      unidad: "unidad",
      costo: 18e4,
      precio: 26e4,
      ivaPct: 19,
      activo: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: uid("prd"),
      nombre: "NVR 8 Canales PoE",
      sku: "NVR-8-POE-01",
      categoria: "Grabadores (DVR/NVR)",
      marca: "Dahua",
      unidad: "unidad",
      costo: 65e4,
      precio: 9e5,
      ivaPct: 19,
      activo: true,
      createdAt: now,
      updatedAt: now
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
      updatedAt: now
    }
  ];
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(seed));
}
function seedKitsIfEmpty() {
  if (typeof window === "undefined") return;
  seedProductsIfEmpty();
  const kits = safeParse(localStorage.getItem(KEY_KITS), []);
  if (kits.length > 0) return;
  const prods = safeParse(localStorage.getItem(KEY_PRODUCTS), []);
  const cam = prods.find((p) => p.sku === "CAM-IP-4MP-01")?.id;
  const nvr = prods.find((p) => p.sku === "NVR-8-POE-01")?.id;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const seed = [
    {
      id: uid("kit"),
      nombre: "Kit Básico 2 Cámaras + NVR",
      descripcion: "Ideal para negocio pequeño.",
      items: [
        ...cam ? [{ productId: cam, qty: 2 }] : [],
        ...nvr ? [{ productId: nvr, qty: 1 }] : []
      ],
      descuentoPct: 5,
      activo: true,
      createdAt: now,
      updatedAt: now
    }
  ];
  localStorage.setItem(KEY_KITS, JSON.stringify(seed));
}
function listProductos(search = "", filters) {
  if (typeof window === "undefined") return [];
  seedProductsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_PRODUCTS), []);
  const q = search.trim().toLowerCase();
  const cat = filters?.categoria?.trim() || "";
  const mar = filters?.marca?.trim() || "";
  const act = filters?.activo || "all";
  return list.filter((p) => {
    if (act === "active" && p.activo === false) return false;
    if (act === "inactive" && p.activo !== false) return false;
    if (cat && (p.categoria || "") !== cat) return false;
    if (mar && (p.marca || "") !== mar) return false;
    if (!q) return true;
    const blob = [p.nombre, p.sku, p.categoria, p.marca, p.unidad].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function getProducto(id) {
  if (typeof window === "undefined") return null;
  seedProductsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_PRODUCTS), []);
  return list.find((p) => p.id === id) ?? null;
}
function createProducto(data) {
  if (typeof window === "undefined") throw new Error("createProducto debe ejecutarse en el browser");
  seedProductsIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nuevo = {
    id: uid("prd"),
    createdAt: now,
    updatedAt: now,
    activo: data.activo ?? true,
    ...data
  };
  const list = safeParse(localStorage.getItem(KEY_PRODUCTS), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list));
  return nuevo;
}
function updateProducto(id, patch) {
  if (typeof window === "undefined") throw new Error("updateProducto debe ejecutarse en el browser");
  seedProductsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_PRODUCTS), []);
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Producto no existe");
  const updated = {
    ...list[idx],
    ...patch,
    id,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  list[idx] = updated;
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list));
  return updated;
}
function deleteProducto(id) {
  if (typeof window === "undefined") throw new Error("deleteProducto debe ejecutarse en el browser");
  seedProductsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_PRODUCTS), []);
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(list.filter((p) => p.id !== id)));
}
function getProductoMeta() {
  if (typeof window === "undefined") return { categorias: [], marcas: [] };
  seedMetaIfEmpty();
  return safeParse(localStorage.getItem(KEY_META), { categorias: [], marcas: [] });
}
function setMeta(meta) {
  localStorage.setItem(KEY_META, JSON.stringify(meta));
}
function addCategoria(nombre) {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const meta = getProductoMeta();
  const n = nombre.trim();
  if (!n) return;
  if (meta.categorias.some((c) => c.toLowerCase() === n.toLowerCase())) return;
  meta.categorias.push(n);
  meta.categorias.sort((a, b) => a.localeCompare(b));
  setMeta(meta);
}
function removeCategoria(nombre) {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const meta = getProductoMeta();
  meta.categorias = meta.categorias.filter((c) => c !== nombre);
  setMeta(meta);
}
function addMarca(nombre) {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const meta = getProductoMeta();
  const n = nombre.trim();
  if (!n) return;
  if (meta.marcas.some((m) => m.toLowerCase() === n.toLowerCase())) return;
  meta.marcas.push(n);
  meta.marcas.sort((a, b) => a.localeCompare(b));
  setMeta(meta);
}
function removeMarca(nombre) {
  if (typeof window === "undefined") return;
  seedMetaIfEmpty();
  const meta = getProductoMeta();
  meta.marcas = meta.marcas.filter((m) => m !== nombre);
  setMeta(meta);
}
function listKits(search = "") {
  if (typeof window === "undefined") return [];
  seedKitsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_KITS), []);
  const q = search.trim().toLowerCase();
  return list.filter((k) => {
    if (!q) return true;
    return [k.nombre, k.descripcion].filter(Boolean).join(" ").toLowerCase().includes(q);
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function createKit(data) {
  if (typeof window === "undefined") throw new Error("createKit debe ejecutarse en el browser");
  seedKitsIfEmpty();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nuevo = {
    id: uid("kit"),
    createdAt: now,
    updatedAt: now,
    activo: data.activo ?? true,
    ...data
  };
  const list = safeParse(localStorage.getItem(KEY_KITS), []);
  list.unshift(nuevo);
  localStorage.setItem(KEY_KITS, JSON.stringify(list));
  return nuevo;
}
function deleteKit(id) {
  if (typeof window === "undefined") throw new Error("deleteKit debe ejecutarse en el browser");
  seedKitsIfEmpty();
  const list = safeParse(localStorage.getItem(KEY_KITS), []);
  localStorage.setItem(KEY_KITS, JSON.stringify(list.filter((k) => k.id !== id)));
}
function calcKitTotal(kit) {
  const prods = safeParse(localStorage.getItem(KEY_PRODUCTS), []);
  let subtotal = 0;
  for (const it of kit.items) {
    const p = prods.find((pp) => pp.id === it.productId);
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

export { listKits as a, removeMarca as b, calcKitTotal as c, addCategoria as d, addMarca as e, createProducto as f, getProductoMeta as g, createKit as h, deleteKit as i, getProducto as j, deleteProducto as k, listProductos as l, removeCategoria as r, updateProducto as u };
