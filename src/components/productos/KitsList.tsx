import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { deleteKit, listKits, calcKitTotal } from "../../lib/repositories/productoRepo";

function money(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

export default function KitsList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);

  const kits = useMemo(() => listKits(q), [q, refresh]);

  useEffect(() => { listKits(""); setRefresh(n => n + 1); }, []);

  const onDelete = (id: string) => {
    const ok = confirm("¿Eliminar este kit? Esta acción no se puede deshacer.");
    if (!ok) return;
    deleteKit(id);
    setRefresh(n => n + 1);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kits / Combos</h1>
          <p className="text-sm text-gray-500">Combina productos en paquetes con descuento o precio fijo.</p>
        </div>
        <div className="flex gap-2">
          <a href="/productos" className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">Volver</a>
          <a href="/productos/kits/nuevo" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Crear kit
          </a>
        </div>
      </header>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar kit..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">{kits.length} kit(s)</p>
        </div>

        {kits.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">No hay kits</p>
            <p className="text-sm text-gray-500 mt-1">Crea el primer kit para usarlo en cotizaciones.</p>
            <a href="/productos/kits/nuevo" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Crear kit
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Kit</th>
                <th className="px-5 py-3 text-left font-semibold">Items</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kits.map((k) => {
                const t = calcKitTotal(k);
                return (
                  <tr key={k.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900">{k.nombre}</div>
                      <div className="text-xs text-gray-500">{k.descripcion || "—"}</div>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{k.items.length}</td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900">{money(t.total)}</div>
                      <div className="text-xs text-gray-500">Subtotal: {money(t.subtotal)}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <button className="rounded-lg border border-gray-300 p-2 hover:bg-white" onClick={() => onDelete(k.id)} title="Eliminar">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

