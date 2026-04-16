import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye, Copy } from "lucide-react";
import { deleteCotizacion, listCotizaciones } from "../../lib/repositories/cotizacionRepo";

type Cotizacion = {
  id: string;
  numero: string;
  version?: number;
  parentId?: string | null;
  status?: string;
  fecha?: string;
  vigenciaDias?: number;
  asunto?: string;
  subtotal?: number;
  iva?: number;
  total?: number;
  cliente?: {
    nombre?: string;
  } | null;
  clienteNombre?: string;
};

export default function CotizacionesList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [list, setList] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCotizaciones() {
      try {
        setLoading(true);
        const data = await listCotizaciones(q);

        if (!cancelled) {
          setList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error cargando cotizaciones:", error);
        if (!cancelled) setList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCotizaciones();

    return () => {
      cancelled = true;
    };
  }, [q, refresh]);

  const counters = useMemo(() => {
    const borrador = list.filter((x) => (x.status || "").toLowerCase() === "borrador").length;
    const aprobada = list.filter((x) => (x.status || "").toLowerCase() === "aprobada").length;
    const rechazada = list.filter((x) => (x.status || "").toLowerCase() === "rechazada").length;

    return {
      total: list.length,
      borrador,
      aprobada,
      rechazada,
    };
  }, [list]);

  const onDelete = async (id: string) => {
    const ok = confirm("¿Eliminar esta cotización? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      await deleteCotizacion(id);
      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error eliminando cotización:", error);
      alert("No fue posible eliminar la cotización.");
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cotizaciones</h1>
          <p className="text-sm text-gray-500">Listado, búsqueda y gestión de cotizaciones.</p>
        </div>

        <a
          href="/cotizaciones/nueva"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nueva cotización
        </a>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{counters.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Borrador</p>
          <p className="mt-2 text-2xl font-semibold text-gray-700">{counters.borrador}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Aprobada</p>
          <p className="mt-2 text-2xl font-semibold text-green-700">{counters.aprobada}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Rechazada</p>
          <p className="mt-2 text-2xl font-semibold text-red-700">{counters.rechazada}</p>
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
            {loading ? "Cargando..." : `${list.length} cotización(es)`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Cargando cotizaciones...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">No hay cotizaciones para mostrar</p>
            <p className="text-sm text-gray-500 mt-1">
              Si esperabas ver registros, revisa si la tabla está vacía o si faltan datos sembrados.
            </p>
            <a
              href="/cotizaciones/nueva"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Crear cotización
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Documento</th>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{c.numero}</div>
                    <div className="text-xs text-gray-500">
                      V{c.version || 1}{c.parentId ? " • versionada" : ""}
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <div className="text-gray-900 font-medium">{c.cliente?.nombre || c.clienteNombre || "—"}</div>
                    <div className="text-xs text-gray-500">{c.asunto || "—"}</div>
                  </td>

                  <td className="px-5 py-3 text-gray-700">{c.fecha || "—"}</td>

                  <td className="px-5 py-3 text-gray-700">
                    ${Number(c.total || 0).toLocaleString("es-CO")}
                  </td>

                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      (c.status || "").toLowerCase() === "aprobada"
                        ? "bg-green-100 text-green-700"
                        : (c.status || "").toLowerCase() === "rechazada"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }`}>
                      {c.status || "borrador"}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        href={`/cotizaciones/${c.id}`}
                        title="Ver"
                      >
                        <Eye className="h-4 w-4" />
                      </a>

                      <a
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        href={`/cotizaciones/${c.id}/editar`}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </a>

                      <a
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        href={`/cotizaciones/${c.id}/duplicar`}
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </a>

                      <button
                        type="button"
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(c.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
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