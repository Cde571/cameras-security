import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ActivoEntregado } from "../../lib/services/actaLocalService";

type Props = {
  value: ActivoEntregado[];
  onChange: (next: ActivoEntregado[]) => void;
};

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? `itm_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export default function ActivosTable({ value, onChange }: Props) {
  const add = () => onChange([{ id: uid(), tipo: "camara", descripcion: "Nuevo ítem", cantidad: 1 }, ...value]);
  const remove = (id: string) => onChange(value.filter(v => v.id !== id));
  const set = (id: string, patch: Partial<ActivoEntregado>) => onChange(value.map(v => v.id === id ? ({ ...v, ...patch }) : v));

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <p className="text-sm font-semibold text-gray-800">Activos / elementos entregados</p>
        <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Agregar
        </button>
      </div>

      {value.length === 0 ? (
        <div className="p-5 text-sm text-gray-600">Agrega los elementos entregados.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Tipo</th>
              <th className="px-5 py-3 text-left font-semibold">Descripción</th>
              <th className="px-5 py-3 text-right font-semibold">Cant</th>
              <th className="px-5 py-3 text-left font-semibold">Serial</th>
              <th className="px-5 py-3 text-left font-semibold">Ubicación</th>
              <th className="px-5 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {value.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <select
                    value={a.tipo}
                    onChange={(e) => set(a.id, { tipo: e.target.value as any })}
                    className="rounded-lg border border-gray-200 bg-white px-2 py-2"
                  >
                    <option value="camara">Cámara</option>
                    <option value="dvr_nvr">DVR / NVR</option>
                    <option value="disco">Disco</option>
                    <option value="accesorio">Accesorio</option>
                    <option value="cableado">Cableado</option>
                    <option value="otro">Otro</option>
                  </select>
                </td>

                <td className="px-5 py-3">
                  <input
                    value={a.descripcion}
                    onChange={(e) => set(a.id, { descripcion: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </td>

                <td className="px-5 py-3 text-right">
                  <input
                    type="number"
                    value={a.cantidad}
                    onChange={(e) => set(a.id, { cantidad: Number(e.target.value || 0) })}
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-right"
                  />
                </td>

                <td className="px-5 py-3">
                  <input
                    value={a.serial || ""}
                    onChange={(e) => set(a.id, { serial: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </td>

                <td className="px-5 py-3">
                  <input
                    value={a.ubicacion || ""}
                    onChange={(e) => set(a.id, { ubicacion: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </td>

                <td className="px-5 py-3 text-right">
                  <button type="button" onClick={() => remove(a.id)} className="rounded-lg border border-gray-300 p-2 hover:bg-white">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="px-5 py-3 text-xs text-gray-500 border-t border-gray-200">
        Tip: si quieres, luego agregamos “notas por ítem” en un modal.
      </div>
    </div>
  );
}
