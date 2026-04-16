import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { createProducto, getProducto, getProductoMeta, updateProducto } from "../../lib/repositories/productoRepo";

type Props = { mode: "create" | "edit"; productoId?: string };

function num(v: any) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function money(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

export default function ProductoForm({ mode, productoId }: Props) {
  const isEdit = mode === "edit";
  const meta = useMemo(() => getProductoMeta(), []);
  const [loading, setLoading] = useState(isEdit);

  const [form, setForm] = useState({
    nombre: "",
    sku: "",
    categoria: meta.categorias[0] || "",
    marca: meta.marcas[0] || "",
    unidad: "unidad",
    costo: 0,
    precio: 0,
    ivaPct: 19,
    activo: true,
  });

  useEffect(() => {
    if (!isEdit || !productoId) return;
    const p = getProducto(productoId);
    if (p) {
      setForm({
        nombre: p.nombre || "",
        sku: p.sku || "",
        categoria: p.categoria || meta.categorias[0] || "",
        marca: p.marca || meta.marcas[0] || "",
        unidad: p.unidad || "unidad",
        costo: Number(p.costo || 0),
        precio: Number(p.precio || 0),
        ivaPct: Number(p.ivaPct ?? 19),
        activo: p.activo !== false,
      });
    }
    setLoading(false);
  }, [isEdit, productoId]);

  const canSave = useMemo(() => form.nombre.trim().length >= 3, [form.nombre]);

  const utilidad = useMemo(() => Number(form.precio) - Number(form.costo), [form.precio, form.costo]);
  const margenPct = useMemo(() => (form.precio > 0 ? (utilidad / form.precio) * 100 : 0), [utilidad, form.precio]);
  const precioConIva = useMemo(() => form.precio * (1 + (form.ivaPct || 0) / 100), [form.precio, form.ivaPct]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return alert("El nombre del producto es obligatorio (mínimo 3 caracteres).");

    if (isEdit && productoId) {
      updateProducto(productoId, {
        ...form,
        costo: num(form.costo),
        precio: num(form.precio),
        ivaPct: num(form.ivaPct),
      });
      window.location.href = "/productos";
      return;
    }

    createProducto({
      ...form,
      costo: num(form.costo),
      precio: num(form.precio),
      ivaPct: num(form.ivaPct),
    });
    window.location.href = "/productos";
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{isEdit ? "Editar producto" : "Crear producto"}</h1>
          <p className="text-sm text-gray-500">{isEdit ? "Actualiza el catálogo." : "Agrega un producto para cotizaciones y kits."}</p>
        </div>

        <div className="flex gap-2">
          <a href="/productos" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="submit"
            disabled={!canSave}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
              canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Datos</h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Nombre *</label>
            <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: Cámara IP 4MP"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">SKU</label>
            <input value={form.sku} onChange={(e) => set("sku", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: CAM-IP-4MP-01"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Categoría</label>
              <select value={form.categoria} onChange={(e) => set("categoria", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
              >
                {meta.categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Marca</label>
              <select value={form.marca} onChange={(e) => set("marca", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
              >
                {meta.marcas.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-gray-600">Unidad</label>
              <input value={form.unidad} onChange={(e) => set("unidad", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="unidad / metro / paquete"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Estado</label>
              <select value={form.activo ? "1" : "0"} onChange={(e) => set("activo", e.target.value === "1")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Precios</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Costo</label>
              <input type="number" value={form.costo} onChange={(e) => set("costo", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Precio venta</label>
              <input type="number" value={form.precio} onChange={(e) => set("precio", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">IVA %</label>
              <input type="number" value={form.ivaPct} onChange={(e) => set("ivaPct", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 space-y-1">
            <div className="flex justify-between"><span>Utilidad</span><span className="font-semibold">{money(utilidad)}</span></div>
            <div className="flex justify-between"><span>Margen</span><span className="font-semibold">{margenPct.toFixed(1)}%</span></div>
            <div className="flex justify-between"><span>Precio con IVA</span><span className="font-semibold">{money(precioConIva)}</span></div>
          </div>
        </section>
      </div>
    </form>
  );
}

