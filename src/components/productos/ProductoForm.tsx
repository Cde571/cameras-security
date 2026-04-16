import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { createProducto, getProducto, getProductoMeta, updateProducto } from "../../lib/repositories/productoRepo";

type Props = {
  mode?: "create" | "edit";
  productoId?: string;
};

type Meta = {
  categorias: string[];
  marcas: string[];
  total: number;
  activos: number;
  inactivos: number;
};

const emptyMeta: Meta = {
  categorias: [],
  marcas: [],
  total: 0,
  activos: 0,
  inactivos: 0,
};

export default function ProductoForm({ mode = "create", productoId }: Props) {
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState<Meta>(emptyMeta);

  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    sku: "",
    descripcion: "",
    categoria: "",
    marca: "",
    unidad: "unidad",
    costo: 0,
    precio: 0,
    ivaPct: 19,
    stock: 0,
    activo: true,
    estado: "activo",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        const metaData = await getProductoMeta();
        if (!cancelled) {
          const safeMeta = metaData && typeof metaData === "object"
            ? {
                categorias: Array.isArray(metaData.categorias) ? metaData.categorias : [],
                marcas: Array.isArray(metaData.marcas) ? metaData.marcas : [],
                total: Number(metaData.total || 0),
                activos: Number(metaData.activos || 0),
                inactivos: Number(metaData.inactivos || 0),
              }
            : emptyMeta;

          setMeta(safeMeta);

          setForm((prev) => ({
            ...prev,
            categoria: prev.categoria || safeMeta.categorias[0] || "",
            marca: prev.marca || safeMeta.marcas[0] || "",
          }));
        }

        if (isEdit && productoId) {
          const p = await getProducto(productoId);

          if (!cancelled && p) {
            setForm({
              nombre: p.nombre || "",
              codigo: p.codigo || "",
              sku: p.sku || "",
              descripcion: p.descripcion || "",
              categoria: p.categoria || "",
              marca: p.marca || "",
              unidad: p.unidad || "unidad",
              costo: Number(p.costo || 0),
              precio: Number(p.precio || 0),
              ivaPct: Number(p.ivaPct || p.iva_pct || 19),
              stock: Number(p.stock || 0),
              activo: p.activo !== false,
              estado: p.estado || (p.activo === false ? "inactivo" : "activo"),
            });
          }
        }
      } catch (error) {
        console.error("Error cargando formulario de producto:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isEdit, productoId]);

  const canSave = useMemo(() => {
    return form.nombre.trim().length >= 3;
  }, [form.nombre]);

  const onChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSave) {
      alert("El nombre del producto es obligatorio.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        costo: Number(form.costo || 0),
        precio: Number(form.precio || 0),
        ivaPct: Number(form.ivaPct || 19),
        stock: Number(form.stock || 0),
        activo: Boolean(form.activo),
        estado: form.activo ? "activo" : "inactivo",
      };

      if (isEdit && productoId) {
        await updateProducto(productoId, payload);
        window.location.href = "/productos";
        return;
      }

      await createProducto(payload);
      window.location.href = "/productos";
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("No fue posible guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando formulario...</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit ? "Actualiza la información del producto." : "Registra un producto nuevo en el catálogo."}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/productos"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="submit"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
              canSave && !saving ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
            disabled={!canSave || saving}
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Datos principales</h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Nombre *</label>
            <input
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Ej: Cámara IP 4MP"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Código</label>
              <input
                value={form.codigo}
                onChange={(e) => onChange("codigo", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ej: CAM-001"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">SKU</label>
              <input
                value={form.sku}
                onChange={(e) => onChange("sku", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ej: SKU-123"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => onChange("descripcion", e.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Clasificación y valores</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => onChange("categoria", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Seleccionar</option>
                {meta.categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Marca</label>
              <select
                value={form.marca}
                onChange={(e) => onChange("marca", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Seleccionar</option>
                {meta.marcas.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Unidad</label>
              <input
                value={form.unidad}
                onChange={(e) => onChange("unidad", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => onChange("stock", Number(e.target.value || 0))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Costo</label>
              <input
                type="number"
                value={form.costo}
                onChange={(e) => onChange("costo", Number(e.target.value || 0))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Precio</label>
              <input
                type="number"
                value={form.precio}
                onChange={(e) => onChange("precio", Number(e.target.value || 0))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">IVA %</label>
              <input
                type="number"
                value={form.ivaPct}
                onChange={(e) => onChange("ivaPct", Number(e.target.value || 19))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => onChange("activo", e.target.checked)}
            />
            Producto activo
          </label>
        </section>
      </div>
    </form>
  );
}