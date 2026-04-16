import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { listProductos, listKits, calcKitTotal } from "../../lib/repositories/productoRepo";
import type { CotizacionItem } from "../../lib/repositories/cotizacionRepo";

type Props = {
  onAdd: (item: CotizacionItem) => void;
};

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? `it_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export default function ProductoSelector({ onAdd }: Props) {
  const productos = useMemo(() => listProductos("", { activo: "active" }), []);
  const kits = useMemo(() => listKits(""), []);

  const [tab, setTab] = useState<"producto" | "kit" | "servicio">("producto");

  const [productId, setProductId] = useState(productos[0]?.id ?? "");
  const [kitId, setKitId] = useState(kits[0]?.id ?? "");

  const [qty, setQty] = useState(1);

  const [srvNombre, setSrvNombre] = useState("Instalación y configuración");
  const [srvPrecio, setSrvPrecio] = useState<number>(0);
  const [srvIva, setSrvIva] = useState<number>(19);

  const addProducto = () => {
    const p = productos.find((x) => x.id === productId);
    if (!p) return;
    onAdd({
      id: uid(),
      kind: "producto",
      refId: p.id,
      nombre: p.nombre,
      unidad: p.unidad || "unidad",
      qty: Number(qty || 1),
      precio: Number(p.precio || 0),
      ivaPct: Number(p.ivaPct ?? 19),
      costo: Number(p.costo || 0),
    });
  };

  const addKit = () => {
    const k = kits.find((x) => x.id === kitId);
    if (!k) return;
    const tot = calcKitTotal(k);
    onAdd({
      id: uid(),
      kind: "kit",
      refId: k.id,
      nombre: k.nombre,
      unidad: "kit",
      qty: Number(qty || 1),
      precio: Number(tot.total || 0),
      ivaPct: 19,
    });
  };

  const addServicio = () => {
    if (!srvNombre.trim()) return;
    onAdd({
      id: uid(),
      kind: "servicio",
      nombre: srvNombre.trim(),
      unidad: "servicio",
      qty: 1,
      precio: Number(srvPrecio || 0),
      ivaPct: Number(srvIva || 0),
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
      <h3 className="font-semibold text-gray-900">Agregar ítems</h3>

      <div className="flex gap-2">
        {(["producto","kit","servicio"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-2 text-sm border ${
              tab === t ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t === "producto" ? "Producto" : t === "kit" ? "Kit" : "Servicio"}
          </button>
        ))}
      </div>

      {tab === "producto" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-600">Producto</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Cantidad</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value || 1))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <button type="button" onClick={addProducto} className="md:col-span-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Agregar producto
          </button>
        </div>
      )}

      {tab === "kit" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-600">Kit</label>
            <select
              value={kitId}
              onChange={(e) => setKitId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {kits.map((k) => (
                <option key={k.id} value={k.id}>{k.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Cantidad</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value || 1))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <button type="button" onClick={addKit} className="md:col-span-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Agregar kit
          </button>

          {kits.length === 0 ? (
            <p className="md:col-span-3 text-xs text-gray-500">
              No hay kits. Crea en /productos/kits.
            </p>
          ) : null}
        </div>
      )}

      {tab === "servicio" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-600">Nombre del servicio</label>
            <input value={srvNombre} onChange={(e) => setSrvNombre(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Ej: Instalación y configuración"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Precio</label>
            <input type="number" value={srvPrecio} onChange={(e) => setSrvPrecio(Number(e.target.value || 0))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">IVA %</label>
            <input type="number" value={srvIva} onChange={(e) => setSrvIva(Number(e.target.value || 0))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <button type="button" onClick={addServicio} className="md:col-span-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Agregar servicio
          </button>
        </div>
      )}
    </div>
  );
}

