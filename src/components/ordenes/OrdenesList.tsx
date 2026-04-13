import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, ClipboardList, Image } from "lucide-react";
import { deleteOrden, listOrdenes } from "../../lib/services/ordenLocalService";

export default function OrdenesList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);

  const list = useMemo(() => listOrdenes(q), [q, refresh]);

  useEffect(() => {
    listOrdenes("");
    setRefresh((n) => n + 1);
  }, []);

  const onDelete = (id: string) => {
    const ok = confirm("¿Eliminar esta orden? Esta acción no se puede deshacer.");
    if (!ok) return;
    deleteOrden(id);
    setRefresh((n) => n + 1);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Órdenes de trabajo</h1>
          <p className="text-sm text-gray-500">Listado, creación, checklist y evidencias.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href="/ordenes/nueva" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Nueva orden
          </a>
          <a href="/ordenes/checklists" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ClipboardList className="h-4 w-4" />
            Checklists
          </a>
        </div>
      </header>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por OT, cliente, técnico, estado..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">{list.length} orden(es)</p>
          <p className="text-xs text-gray-500">Tip: evidencias son locales (front-first)</p>
        </div>

        {list.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">No hay órdenes</p>
            <p className="text-sm text-gray-500 mt-1">Crea la primera orden.</p>
            <a href="/ordenes/nueva" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Nueva orden
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Número</th>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-left font-semibold">Programada</th>
                <th className="px-5 py-3 text-left font-semibold">Técnico</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {list.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{o.numero}</div>
                    <div className="text-xs text-gray-500">{o.asunto || "—"}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-gray-900 font-medium">{o.cliente?.nombre || "—"}</div>
                    <div className="text-xs text-gray-500">{o.cliente?.ciudad || ""}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{o.fechaProgramada || "—"}</td>
                  <td className="px-5 py-3 text-gray-700">{o.tecnico?.nombre || "—"}</td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/ordenes/${o.id}`} title="Ver">
                        <Eye className="h-4 w-4" />
                      </a>
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/ordenes/${o.id}/editar`} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </a>
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/ordenes/${o.id}/evidencias`} title="Evidencias">
                        <Image className="h-4 w-4" />
                      </a>
                      <button className="rounded-lg border border-gray-300 p-2 hover:bg-white" onClick={() => onDelete(o.id)} title="Eliminar">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
