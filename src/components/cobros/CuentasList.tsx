import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, FileText } from "lucide-react";
import {
  deleteCuentaCobro,
  listCuentasCobro,
  type CuentaCobro
} from "../../lib/repositories/cobroRepo";

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function CuentasList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [list, setList] = useState<CuentaCobro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const rows = await listCuentasCobro(q);
        if (!cancelled) setList(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Error cargando cuentas de cobro:", error);
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
      pendientes: list.filter((x) => x.status === "pendiente").length,
      pagadas: list.filter((x) => x.status === "pagada").length,
      vencidas: list.filter((x) => x.status === "vencida").length,
    };
  }, [list]);

  const onDelete = async (id: string) => {
    const ok = confirm("¿Eliminar esta cuenta de cobro?");
    if (!ok) return;

    try {
      await deleteCuentaCobro(id);
      setRefresh((n) => n + 1);
    } catch (error) {
      console.error("Error eliminando cuenta de cobro:", error);
      alert("No fue posible eliminar la cuenta de cobro.");
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cuentas de cobro</h1>
          <p className="text-sm text-gray-500">Módulo conectado al backend PostgreSQL.</p>
        </div>

        <a
          href="/cobros/nueva"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nueva cuenta
        </a>
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
          <p className="text-xs font-semibold text-gray-500">Pagadas</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">{stats.pagadas}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Vencidas</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">{stats.vencidas}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por número, cliente u observaciones..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-medium text-gray-700">
            {loading ? "Cargando..." : `${list.length} cuenta(s)`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="font-medium text-gray-700">Cargando cuentas de cobro...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-gray-700">No hay cuentas de cobro</p>
            <p className="mt-1 text-sm text-gray-500">Crea la primera cuenta en PostgreSQL.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Número</th>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Emisión</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">{c.numero}</td>

                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{c.cliente?.nombre || "—"}</div>
                    <div className="text-xs text-gray-500">{c.cliente?.documento || ""}</div>
                  </td>

                  <td className="px-5 py-3 text-gray-700">{c.fechaEmision || "—"}</td>

                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {c.status}
                    </span>
                  </td>

                  <td className="px-5 py-3 font-medium text-gray-900">{money(c.total)}</td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        href={`/cobros/${c.id}`}
                        title="Ver"
                      >
                        <Eye className="h-4 w-4" />
                      </a>

                      <a
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        href={`/cobros/${c.id}/editar`}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </a>

                      <a
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        href={`/cobros/${c.id}/pdf`}
                        title="PDF"
                      >
                        <FileText className="h-4 w-4" />
                      </a>

                      <button
                        className="rounded-lg border border-gray-300 p-2 hover:bg-white"
                        onClick={() => onDelete(c.id)}
                        title="Eliminar"
                      >
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