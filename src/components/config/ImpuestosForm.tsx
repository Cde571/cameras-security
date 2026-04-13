import React, { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { deleteImpuesto, listImpuestos, upsertImpuesto, type Impuesto } from "../../lib/services/configLocalService";

export default function ImpuestosForm() {
  const [list, setList] = useState<Impuesto[]>([]);
  const [newItem, setNewItem] = useState({ nombre: "", porcentaje: 0 });

  const refresh = () => setList(listImpuestos());

  useEffect(() => { refresh(); }, []);

  const create = () => {
    if (!newItem.nombre.trim()) return alert("Nombre requerido");
    upsertImpuesto({ nombre: newItem.nombre.trim(), porcentaje: Number(newItem.porcentaje || 0), activo: true } as any);
    setNewItem({ nombre: "", porcentaje: 0 });
    refresh();
  };

  const update = (id: string, patch: Partial<Impuesto>) => {
    const cur = list.find(x => x.id === id);
    if (!cur) return;
    upsertImpuesto({ ...cur, ...patch } as any);
    refresh();
  };

  const remove = (id: string) => {
    if (!confirm("¿Eliminar impuesto?")) return;
    deleteImpuesto(id);
    refresh();
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Impuestos</h1>
        <p className="text-sm text-gray-500">IVA, retenciones, etc.</p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900">Crear impuesto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={newItem.nombre} onChange={(e) => setNewItem(p => ({ ...p, nombre: e.target.value }))}
            placeholder="Nombre (IVA)"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input type="number" value={newItem.porcentaje} onChange={(e) => setNewItem(p => ({ ...p, porcentaje: Number(e.target.value || 0) }))}
            placeholder="%"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button onClick={create} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800">
          {list.length} impuesto(s)
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Nombre</th>
              <th className="px-5 py-3 text-left font-semibold">%</th>
              <th className="px-5 py-3 text-left font-semibold">Activo</th>
              <th className="px-5 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <input value={t.nombre} onChange={(e) => update(t.id, { nombre: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </td>
                <td className="px-5 py-3">
                  <input type="number" value={t.porcentaje} onChange={(e) => update(t.id, { porcentaje: Number(e.target.value || 0) })}
                    className="w-28 rounded-lg border border-gray-200 px-3 py-2"
                  />
                </td>
                <td className="px-5 py-3">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={t.activo} onChange={(e) => update(t.id, { activo: e.target.checked })}
                    />
                    <span className="text-gray-700">Sí</span>
                  </label>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => remove(t.id)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50">
                    <Trash2 className="h-4 w-4 text-red-600" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
