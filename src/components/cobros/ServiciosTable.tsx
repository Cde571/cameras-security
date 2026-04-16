import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ServicioCobro } from "../../lib/repositories/cobroPagoRepo";

type Props = {
  value: ServicioCobro[];
  onChange: (next: ServicioCobro[]) => void;
};

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? `srv_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export default function ServiciosTable({ value, onChange }: Props) {
  const add = () => onChange([{ id: uid(), descripcion: "Nuevo servicio", cantidad: 1, unitario: 0, ivaPct: 19 }, ...value]);
  const remove = (id: string) => onChange(value.filter(v => v.id !== id));
  const set = (id: string, patch: Partial<ServicioCobro>) => onChange(value.map(v => v.id === id ? ({ ...v, ...patch }) : v));

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <p className="text-sm font-semibold text-gray-800">Servicios</p>
        <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Agregar
        </button>
      </div>

      {value.length === 0 ? (
        <div className="p-5 text-sm text-gray-600">Agrega servicios para calcular totales.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Descripción</th>
              <th className="px-5 py-3 text-right font-semibold">Cant</th>
              <th className="px-5 py-3 text-right font-semibold">Unitario</th>
              <th className="px-5 py-3 text-right font-semibold">IVA %</th>
              <th className="px-5 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {value.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <input
                    value={s.descripcion}
                    onChange={(e) => set(s.id, { descripcion: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  <input
                    type="number"
                    value={s.cantidad}
                    onChange={(e) => set(s.id, { cantidad: Number(e.target.value || 0) })}
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-right"
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  <input
                    type="number"
                    value={s.unitario}
                    onChange={(e) => set(s.id, { unitario: Number(e.target.value || 0) })}
                    className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-right"
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  <input
                    type="number"
                    value={s.ivaPct ?? 0}
                    onChange={(e) => set(s.id, { ivaPct: Number(e.target.value || 0) })}
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-right"
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  <button type="button" onClick={() => remove(s.id)} className="rounded-lg border border-gray-300 p-2 hover:bg-white">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

