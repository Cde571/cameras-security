import type { KitBase, ProductoBase, ProductoDuplicadoResult } from "../../types/productoKit";

function normalizeText(value: any): string {
  return String(value ?? "").trim().toLowerCase();
}

function toNumber(value: any): number {
  const n = Number(
    typeof value === "string"
      ? value.replace(/\./g, "").replace(",", ".")
      : value
  );
  return Number.isFinite(n) ? n : 0;
}

function readLocal<T>(key: string): T[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, data: T[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function nowIso() {
  return new Date().toISOString();
}

export async function listProductos(search = ""): Promise<ProductoBase[]> {
  try {
    const url = search ? `/api/productos?q=${encodeURIComponent(search)}` : "/api/productos";
    const res = await fetch(url);
    if (!res.ok) throw new Error("productos api error");
    const data = await res.json();
    if (!data?.ok || !Array.isArray(data?.items)) throw new Error("productos api invalid");
    return data.items;
  } catch {
    const items = readLocal<ProductoBase>("productos");
    const q = normalizeText(search);
    if (!q) return items;
    return items.filter((x) =>
      [x.nombre, x.codigo, x.sku, x.descripcion, x.categoria].some((v) =>
        normalizeText(v).includes(q)
      )
    );
  }
}

export async function getProductoById(id: string): Promise<ProductoBase | null> {
  try {
    const res = await fetch(`/api/productos/${id}`);
    if (!res.ok) throw new Error("producto api error");
    const data = await res.json();
    if (!data?.ok) throw new Error("producto api invalid");
    return data.item ?? null;
  } catch {
    const items = readLocal<ProductoBase>("productos");
    return items.find((x) => String(x.id) === id) ?? null;
  }
}

export async function saveProducto(input: Partial<ProductoBase>): Promise<ProductoBase> {
  const payload = {
    nombre: String(input.nombre ?? "").trim(),
    codigo: String(input.codigo ?? "").trim() || null,
    sku: String(input.sku ?? "").trim() || null,
    descripcion: String(input.descripcion ?? "").trim() || null,
    categoria: String(input.categoria ?? "").trim() || null,
    unidad: String(input.unidad ?? "").trim() || null,
    costo: toNumber(input.costo),
    precio: toNumber(input.precio),
    iva: toNumber(input.iva),
    stock: toNumber(input.stock),
    activo: input.activo === false ? false : true,
  };

  try {
    const res = await fetch(input.id ? `/api/productos/${input.id}` : "/api/productos", {
      method: input.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("save producto api error");
    const data = await res.json();
    if (!data?.ok || !data?.item) throw new Error("save producto api invalid");
    return data.item;
  } catch {
    const items = readLocal<ProductoBase>("productos");
    if (input.id) {
      const next = items.map((x) =>
        String(x.id) === String(input.id)
          ? {
              ...x,
              ...payload,
              id: String(input.id),
              updatedAt: nowIso(),
            }
          : x
      );
      writeLocal("productos", next);
      return next.find((x) => String(x.id) === String(input.id))!;
    }

    const created: ProductoBase = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    writeLocal("productos", [created, ...items]);
    return created;
  }
}

export async function deleteProducto(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete producto api error");
    const data = await res.json();
    return !!data?.ok;
  } catch {
    const items = readLocal<ProductoBase>("productos");
    writeLocal("productos", items.filter((x) => String(x.id) !== id));
    return true;
  }
}

export async function listKits(search = ""): Promise<KitBase[]> {
  try {
    const url = search ? `/api/productos/kits?q=${encodeURIComponent(search)}` : "/api/productos/kits";
    const res = await fetch(url);
    if (!res.ok) throw new Error("kits api error");
    const data = await res.json();
    if (!data?.ok || !Array.isArray(data?.items)) throw new Error("kits api invalid");
    return data.items;
  } catch {
    const items = readLocal<KitBase>("kits");
    const q = normalizeText(search);
    if (!q) return items;
    return items.filter((x) =>
      [x.nombre, x.codigo, x.descripcion].some((v) => normalizeText(v).includes(q))
    );
  }
}

export async function getKitById(id: string): Promise<KitBase | null> {
  try {
    const res = await fetch(`/api/productos/kits/${id}`);
    if (!res.ok) throw new Error("kit api error");
    const data = await res.json();
    if (!data?.ok) throw new Error("kit api invalid");
    return data.item ?? null;
  } catch {
    const items = readLocal<KitBase>("kits");
    return items.find((x) => String(x.id) === id) ?? null;
  }
}

export async function saveKit(input: Partial<KitBase>): Promise<KitBase> {
  const items = Array.isArray(input.items) ? input.items : [];
  const costoTotal = items.reduce((sum, x) => sum + toNumber(x.costoUnitario) * toNumber(x.cantidad), 0);
  const precioTotal = items.reduce((sum, x) => sum + toNumber(x.precioUnitario) * toNumber(x.cantidad), 0);

  const payload = {
    nombre: String(input.nombre ?? "").trim(),
    codigo: String(input.codigo ?? "").trim() || null,
    descripcion: String(input.descripcion ?? "").trim() || null,
    activo: input.activo === false ? false : true,
    items,
    costoTotal,
    precioTotal,
  };

  try {
    const res = await fetch(input.id ? `/api/productos/kits/${input.id}` : "/api/productos/kits", {
      method: input.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("save kit api error");
    const data = await res.json();
    if (!data?.ok || !data?.item) throw new Error("save kit api invalid");
    return data.item;
  } catch {
    const kits = readLocal<KitBase>("kits");
    if (input.id) {
      const next = kits.map((x) =>
        String(x.id) === String(input.id)
          ? {
              ...x,
              ...payload,
              id: String(input.id),
              updatedAt: nowIso(),
            }
          : x
      );
      writeLocal("kits", next);
      return next.find((x) => String(x.id) === String(input.id))!;
    }

    const created: KitBase = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    writeLocal("kits", [created, ...kits]);
    return created;
  }
}

export async function deleteKit(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/productos/kits/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("delete kit api error");
    const data = await res.json();
    return !!data?.ok;
  } catch {
    const kits = readLocal<KitBase>("kits");
    writeLocal("kits", kits.filter((x) => String(x.id) !== id));
    return true;
  }
}

export async function validateProductoDuplicado(input: {
  id?: string;
  codigo?: string;
  sku?: string;
  nombre?: string;
}): Promise<ProductoDuplicadoResult> {
  try {
    const res = await fetch("/api/productos/validate-duplicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("duplicate api error");
    return await res.json();
  } catch {
    const items = readLocal<ProductoBase>("productos");
    const currentId = String(input.id ?? "");
    const codigo = normalizeText(input.codigo);
    const sku = normalizeText(input.sku);
    const nombre = normalizeText(input.nombre);

    const matches = items.filter((x) => {
      if (currentId && String(x.id) === currentId) return false;
      const sameCodigo = codigo && normalizeText(x.codigo) === codigo;
      const sameSku = sku && normalizeText(x.sku) === sku;
      const sameNombre = nombre && normalizeText(x.nombre) === nombre;
      return sameCodigo || sameSku || sameNombre;
    });

    return {
      ok: true,
      duplicated: matches.length > 0,
      matches: matches.map((x) => ({
        id: String(x.id),
        nombre: String(x.nombre),
        codigo: x.codigo ?? undefined,
        sku: x.sku ?? undefined,
      })),
    };
  }
}

export async function exportProductoJson(id: string) {
  const item = await getProductoById(id);
  const blob = new Blob([JSON.stringify(item, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `producto-${id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportKitJson(id: string) {
  const item = await getKitById(id);
  const blob = new Blob([JSON.stringify(item, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kit-${id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
