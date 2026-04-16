import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, FileCheck } from "lucide-react";
import { deleteActa, listActas } from "../../lib/repositories/actaRepo";

type Acta = {
  id: string;
  numero: string;
  cliente?: {
    nombre?: string;
    ciudad?: string;
  } | null;
  fecha?: string;
  lugar?: string;
  status?: string;
};

function badge(status: string) {
  const s = String(status || "").toLowerCase();
  if (s === "firmada") return "bg-green-100 text-green-700";
  if (s === "cerrada") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
}

export default function ActasList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [list, setList] = useState<Acta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadActas() {
      try {
        setLoading(true);
        const data = await listActas(q);

        if (!cancelled) {
          setList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error cargando actas:", error);
        if (!cancelled) setList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadActas();

    return () => {
      cancelled = true;
    };
  }, [q, refresh]);

  const counters = useMemo(() => {
    const borrador = list.filter((x) => String(x.status || "").toLowerCase() === "borrador").length;
    const firmada = list.filter((x) => String(x.status || "").toLowerCase() === "firmada").length;
    const cerrada = list.filter((x) => String(x.status || "").toLowerCase() === "cerrada").length;

    return {
      total: list.length,
      borrador,
      firmada,
      cerrada,
    };
  }, [list]);

  const onDelete = async (id: string) => {
    const ok = confirm("¿Eliminar esta acta? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      await deleteActa(id);
      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error eliminando acta:", error);
      alert("No fue posible eliminar el acta.");
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Actas</h1>
          <p className="text-sm text-gray-500">Gestión de actas de entrega conectadas al backend.</p>
        </div>

        <a
          href="/actas/nueva"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nueva acta
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
          <p className="text-xs font-semibold text-gray-500">Firmadas</p>
          <p className="mt-2 text-2xl font-semibold text-green-700">{counters.firmada}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Cerradas</p>
          <p className="mt-2 text-2xl font-semibold text-blue-700">{counters.cerrada}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por número, cliente o lugar..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">
            {loading ? "Cargando..." : `${list.length} acta(s)`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Cargando actas...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center">
            <FileCheck className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-700 font-medium">No hay actas para mostrar</p>
            <p className="text-sm text-gray-500 mt-1">
              Si esperabas registros, revisa si la tabla está vacía o si faltan datos sembrados.
            </p>
            <a
              href="/actas/nueva"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Crear acta
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Número</th>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">{a.numero}</td>

                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{a.cliente?.nombre || "—"}</div>
                    <div className="text-xs text-gray-500">{a.lugar || a.cliente?.ciudad || "—"}</div>
                  </td>

                  <td className="px-5 py-3 text-gray-700">{a.fecha || "—"}</td>

                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badge(a.status || "borrador")}`}>
                      {a.status || "borrador"}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        href={`/actas/${a.id}`}
                        title="Ver"
                      >
                        <Eye className="h-4 w-4" />
                      </a>

                      <a
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        href={`/actas/${a.id}/editar`}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </a>

                      <button
                        type="button"
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(a.id)}
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