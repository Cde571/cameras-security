import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import { deleteCobro, listCobros } from "../../lib/repositories/cobroPagoRepo";

export default function CuentasList() {
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);
  const list = useMemo(() => listCobros(q), [q, refresh]);

  useEffect(() => {
    listCobros("");
    setRefresh(n => n + 1);
  }, []);

  const onDelete = (id: string) => {
    const ok = confirm("¿Eliminar cuenta de cobro?");
    if (!ok) return;
    deleteCobro(id);
    setRefresh(n => n + 1);
  };

  const badge = (status: string) => {
    const map: any = {
      pendiente: "bg-yellow-100 text-yellow-800",
      enviado: "bg-blue-100 text-blue-800",
      pagado: "bg-green-100 text-green-800",
      vencido: "bg-red-100 text-red-800",
      anulado: "bg-gray-100 text-gray-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cuentas de cobro</h1>
          <p className="text-sm text-gray-500">Listado y gestión de cuentas.</p>
        </div>

        <a href="/cobros/nueva" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Nueva cuenta
        </a>
      </header>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por CC, cliente, estado..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3 text-sm text-gray-700">
          {list.length} cuenta(s)
        </div>

        {list.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-700 font-medium">Sin cuentas</p>
            <a href="/cobros/nueva" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Nueva cuenta
            </a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Número</th>
                <th className="px-5 py-3 text-left font-semibold">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold">Vence</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-right font-semibold">Total</th>
                <th className="px-5 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {list.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">{c.numero}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{c.cliente?.nombre}</div>
                    <div className="text-xs text-gray-500">{c.cliente?.documento || ""}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{c.fechaVencimiento}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${badge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900">
                    {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(c.total || 0)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/cobros/${c.id}`} title="Ver">
                        <Eye className="h-4 w-4" />
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

