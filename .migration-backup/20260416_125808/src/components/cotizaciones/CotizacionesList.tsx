import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, FileText, GitBranch } from "lucide-react";
import { deleteCotizacion, listCotizaciones } from "../../lib/repositories/cotizacionRepo";

function money(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

function calcQuickTotal(items: any[]) {
  const subtotal = items.reduce((acc, it) => acc + Number(it.precio || 0) * Number(it.qty || 0), 0);
  const iva = items.reduce((acc, it) => acc + (Number(it.precio || 0) * Number(it.qty || 0)) * (Number(it.ivaPct || 0) / 100), 0);
  return subtotal + iva;
}

export default function CotizacionesList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);

  const list = useMemo(() => listCotizaciones(q), [q, refresh]);

  useEffect(() => {
    listCotizaciones("");
    setRefresh(n => n + 1);
  }, []);

  const onDelete = (id: string) => {
    const ok = confirm("¿Eliminar esta cotización? Esta acción no se puede deshacer.");
    if (!ok) return;
    deleteCotizacion(id);
    setRefresh(n => n + 1);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cotizaciones</h1>
          <p className="text-sm text-gray-500">Listado, creación, PDF y versionado.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href="/cotizaciones/nueva" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Nueva cotización
          </a>
          <a href="/cotizaciones/plantillas" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            Plantillas de texto
          </a>
        </div>
      </header>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por número, cliente, asunto, estado..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">{list.length} cotización(es)</p>
          <p className="text-xs text-gray-500">Tip: PDF es vista imprimible</p>
        </div>

        {list.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">No hay cotizaciones</p>
            <p className="text-sm text-gray-500 mt-1">Crea la primera cotización.</p>
            <a href="/cotizaciones/nueva" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Nueva cotización
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Número</th>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{c.numero}</div>
                    <div className="text-xs text-gray-500">v{c.version}{c.parentId ? " • versionada" : ""}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-gray-900 font-medium">{c.cliente?.nombre || "—"}</div>
                    <div className="text-xs text-gray-500">{c.asunto || "—"}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{c.fecha}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">{money(calcQuickTotal(c.items || []))}</td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/cotizaciones/${c.id}`} title="Ver">
                        <Eye className="h-4 w-4" />
                      </a>
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/cotizaciones/${c.id}/editar`} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </a>
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/cotizaciones/${c.id}/pdf`} title="PDF">
                        <FileText className="h-4 w-4" />
                      </a>
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/cotizaciones/${c.id}/versionar`} title="Versionar">
                        <GitBranch className="h-4 w-4" />
                      </a>
                      <button className="rounded-lg border border-gray-300 p-2 hover:bg-white" onClick={() => onDelete(c.id)} title="Eliminar">
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

