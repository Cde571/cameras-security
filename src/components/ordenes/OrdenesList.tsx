import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, ClipboardList, Image } from "lucide-react";
import { deleteOrden, listOrdenes, type Orden } from "../../lib/repositories/ordenRepo";

function labelStatus(status: string) {
  switch (status) {
    case "pendiente": return "Pendiente";
    case "en_progreso": return "En progreso";
    case "en_revision": return "En revisión";
    case "finalizada": return "Finalizada";
    case "cancelada": return "Cancelada";
    default: return status || "—";
  }
}

export default function OrdenesList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [list, setList] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const rows = await listOrdenes(q);
        if (!cancelled) setList(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
        if (!cancelled) setList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [q, refresh]);

  const stats = useMemo(() => {
    return {
      total: list.length,
      pendientes: list.filter((o) => o.status === "pendiente").length,
      enProceso: list.filter((o) => o.status === "en_progreso").length,
      completadas: list.filter((o) => o.status === "finalizada").length,
    };
  }, [list]);

  const onDelete = async (id: string) => {
    const ok = confirm("¿Eliminar esta orden? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      await deleteOrden(id);
      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error eliminando orden:", error);
      alert("No fue posible eliminar la orden.");
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Órdenes</h1>
          <p className="text-sm text-gray-500">Gestión de órdenes de trabajo conectadas al backend.</p>
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Pendientes</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.pendientes}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">En proceso</p>
          <p className="mt-2 text-2xl font-semibold text-orange-600">{stats.enProceso}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Completadas</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">{stats.completadas}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por número, cliente o asunto..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">
            {loading ? "Cargando..." : `${list.length} orden(es)`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Cargando órdenes...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">No hay órdenes</p>
            <p className="text-sm text-gray-500 mt-1">Crea la primera orden en PostgreSQL.</p>
            <a href="/ordenes/nueva" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Nueva orden
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Orden</th>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
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

                  <td className="px-5 py-3 text-gray-700">{o.fechaProgramada || o.fechaCreacion || "—"}</td>

                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {labelStatus(o.status)}
                    </span>
                  </td>

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