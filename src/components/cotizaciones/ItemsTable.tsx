import React from "react";
import { Trash2 } from "lucide-react";
import type { CotizacionItem } from "../../lib/services/cotizacionLocalService";

type Props = {
  items: CotizacionItem[];
  onChange: (items: CotizacionItem[]) => void;
};

function money(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

export default function ItemsTable({ items, onChange }: Props) {
  const setItem = (id: string, patch: Partial<CotizacionItem>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-3">
        <p className="text-sm font-semibold text-gray-800">Ítems ({items.length})</p>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">Agrega productos/kits/servicios para continuar.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Ítem</th>
              <th className="px-5 py-3 text-left font-semibold">Tipo</th>
              <th className="px-5 py-3 text-left font-semibold">Cant.</th>
              <th className="px-5 py-3 text-left font-semibold">Precio</th>
              <th className="px-5 py-3 text-left font-semibold">IVA%</th>
              <th className="px-5 py-3 text-left font-semibold">Total</th>
              <th className="px-5 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {items.map((it) => {
              const base = Number(it.precio || 0) * Number(it.qty || 0);
              const iva = base * (Number(it.ivaPct || 0) / 100);
              const total = base + iva;

              return (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <input
                      value={it.nombre}
                      onChange={(e) => setItem(it.id, { nombre: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                    <div className="text-xs text-gray-500 mt-1">{it.unidad || "unidad"}</div>
                  </td>

                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {it.kind}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <input
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) => setItem(it.id, { qty: Number(e.target.value || 1) })}
                      className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="px-5 py-3">
                    <input
                      type="number"
                      value={it.precio}
                      onChange={(e) => setItem(it.id, { precio: Number(e.target.value || 0) })}
                      className="w-36 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="px-5 py-3">
                    <input
                      type="number"
                      value={it.ivaPct}
                      onChange={(e) => setItem(it.id, { ivaPct: Number(e.target.value || 0) })}
                      className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </td>

                  <td className="px-5 py-3 font-semibold text-gray-900">{money(total)}</td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        title="Eliminar"
                      >
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
  );
}
