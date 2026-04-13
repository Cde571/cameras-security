import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getCliente } from "../../lib/services/clienteLocalService";
import { getEstadoCuenta } from "../../lib/services/cobroPagoLocalService";

export default function EstadoCuenta({ clienteId }: { clienteId: string }) {
  const [refresh, setRefresh] = useState(0);
  const data = useMemo(() => getEstadoCuenta(clienteId), [clienteId, refresh]);
  const cliente = useMemo(() => getCliente(clienteId), [clienteId, refresh]);

  useEffect(() => { setRefresh(n => n + 1); }, []);

  const money = useMemo(() => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }), []);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Estado de cuenta</h1>
          <p className="text-sm text-gray-500">{cliente?.nombre || clienteId}</p>
        </div>
        <a href="/pagos/cartera" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" /> Volver
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total cobros</p>
          <p className="text-2xl font-black text-gray-900">{money.format(data.totalCobros)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total pagos</p>
          <p className="text-2xl font-black text-gray-900">{money.format(data.totalPagos)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Saldo</p>
          <p className="text-2xl font-black text-gray-900">{money.format(data.saldo)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-semibold text-gray-800">Cuentas de cobro</p>
        </div>
        {data.cobros.length === 0 ? (
          <div className="p-5 text-sm text-gray-600">Sin cuentas.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Cuenta</th>
                <th className="px-5 py-3 text-left font-semibold">Estado</th>
                <th className="px-5 py-3 text-left font-semibold">Vence</th>
                <th className="px-5 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.cobros.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    <a className="text-blue-600 hover:text-blue-700" href={`/cobros/${c.id}`}>{c.numero}</a>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{c.status}</td>
                  <td className="px-5 py-3 text-gray-700">{c.fechaVencimiento}</td>
                  <td className="px-5 py-3 text-right font-semibold">{money.format(c.total || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-semibold text-gray-800">Pagos</p>
        </div>
        {data.pagos.length === 0 ? (
          <div className="p-5 text-sm text-gray-600">Sin pagos registrados.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                <th className="px-5 py-3 text-left font-semibold">Método</th>
                <th className="px-5 py-3 text-left font-semibold">Referencia</th>
                <th className="px-5 py-3 text-right font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.pagos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-700">{p.fecha}</td>
                  <td className="px-5 py-3 text-gray-700">{p.metodo}</td>
                  <td className="px-5 py-3 text-gray-700">{p.referencia || "—"}</td>
                  <td className="px-5 py-3 text-right font-semibold">{money.format(p.valor || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
