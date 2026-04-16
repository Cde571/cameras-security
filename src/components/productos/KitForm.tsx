import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { createKit, listProductos, type Producto } from "../../lib/repositories/productoRepo";

type Item = { productId: string; qty: number };

function money(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

export default function KitForm() {
  const productos = useMemo(() => listProductos("", { activo: "active" }), []);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [descuentoPct, setDescuentoPct] = useState<number>(0);
  const [precioFijo, setPrecioFijo] = useState<number | "">("");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (productos.length && items.length === 0) {
      setItems([{ productId: productos[0].id, qty: 1 }]);
    }
  }, [productos]);

  const subtotal = useMemo(() => {
    let s = 0;
    for (const it of items) {
      const p = productos.find(pp => pp.id === it.productId);
      if (!p) continue;
      s += Number(p.precio || 0) * Number(it.qty || 0);
    }
    return s;
  }, [items, productos]);

  const total = useMemo(() => {
    if (precioFijo !== "") return Number(precioFijo || 0);
    const d = Number(descuentoPct || 0);
    return subtotal * (1 - d / 100);
  }, [subtotal, descuentoPct, precioFijo]);

  const canSave = nombre.trim().length >= 3 && items.length > 0;

  const setItem = (idx: number, patch: Partial<Item>) => {
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const addItem = () => {
    if (!productos.length) return;
    setItems(prev => [...prev, { productId: productos[0].id, qty: 1 }]);
  };

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return alert("Nombre (mín 3) e items requeridos.");

    createKit({
      nombre,
      descripcion,
      items: items.map(it => ({ productId: it.productId, qty: Number(it.qty || 1) })),
      descuentoPct: precioFijo === "" ? Number(descuentoPct || 0) : undefined,
      precioFijo: precioFijo === "" ? undefined : Number(precioFijo || 0),
      activo: true,
    });

    window.location.href = "/productos/kits";
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Crear kit</h1>
          <p className="text-sm text-gray-500">Paquete de productos con descuento o precio fijo.</p>
        </div>

        <div className="flex gap-2">
          <a href="/productos/kits" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>
          <button disabled={!canSave} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white ${canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}`}>
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-900">Datos del kit</h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Nombre *</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: Kit 4 cámaras + instalación"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              className="min-h-[110px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Condiciones, alcance, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Descuento %</label>
              <input type="number" value={descuentoPct} onChange={(e) => setDescuentoPct(Number(e.target.value || 0))}
                disabled={precioFijo !== ""}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 ${precioFijo !== "" ? "bg-gray-100 border-gray-200" : "border-gray-300"}`}
              />
              <p className="text-[11px] text-gray-500">Se desactiva si usas precio fijo.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600">Precio fijo (opcional)</label>
              <input type="number" value={precioFijo} onChange={(e) => setPrecioFijo(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
            <div className="flex justify-between"><span>Total</span><span className="font-semibold">{money(total)}</span></div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Items</h2>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50">
              <Plus className="h-4 w-4" /> Agregar item
            </button>
          </div>

          {items.map((it, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-800">Item {idx + 1}</p>
                <button type="button" onClick={() => removeItem(idx)} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50" title="Eliminar">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Producto</label>
                  <select value={it.productId} onChange={(e) => setItem(idx, { productId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {productos.map((p: Producto) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Cantidad</label>
                  <input type="number" min={1} value={it.qty} onChange={(e) => setItem(idx, { qty: Number(e.target.value || 1) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>
          ))}

          {!productos.length ? (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
              No hay productos activos para armar kits. Crea productos primero en /productos/nuevo.
            </div>
          ) : null}
        </section>
      </div>
    </form>
  );
}

