import React, { useEffect, useMemo, useState } from "react";
import { DollarSign, Eye } from "lucide-react";
import { getCartera } from "../../lib/services/cobroPagoLocalService";

export default function CarteraTable() {
  const [refresh, setRefresh] = useState(0);
  const data = useMemo(() => getCartera(), [refresh]);

  useEffect(() => {
    setRefresh(n => n + 1);
  }, []);

  const money = useMemo(() => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }), []);

  const Row = ({ c, tone }: any) => (
    <tr className="hover:bg-gray-50">
      <td className="px-5 py-3 font-semibold text-gray-900">{c.numero}</td>
      <td className="px-5 py-3">
        <div className="font-medium text-gray-900">{c.cliente?.nombre}</div>
        <div className="text-xs text-gray-500">{c.cliente?.ciudad || ""}</div>
      </td>
      <td className="px-5 py-3 text-gray-700">{c.fechaVencimiento}</td>
      <td className="px-5 py-3 text-right font-semibold">{money.format(c.total || 0)}</td>
      <td className="px-5 py-3 text-right">
        <div className="flex justify-end gap-2">
          <a className="rounded-lg border border-gray-300 p-2 hover:bg-white" href={`/cobros/${c.id}`} title="Ver">
            <Eye className="h-4 w-4" />
          </a>
          <a className={`rounded-lg px-3 py-2 text-white inline-flex items-center gap-2 ${tone}`} href="/pagos/registrar">
            <DollarSign className="h-4 w-4" /> Registrar pago
          </a>
        </div>
      </td>
    </tr>
  );

  const Table = ({ title, rows, tone }: any) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-sm font-semibold text-gray-900">{money.format(rows.reduce((a: number, x: any) => a + (x.total || 0), 0))}</p>
      </div>
      {rows.length === 0 ? (
        <div className="p-5 text-sm text-gray-600">Sin registros.</div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Cuenta</th>
              <th className="px-5 py-3 text-left font-semibold">Cliente</th>
              <th className="px-5 py-3 text-left font-semibold">Vence</th>
              <th className="px-5 py-3 text-right font-semibold">Total</th>
              <th className="px-5 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((c: any) => <Row key={c.id} c={c} tone={tone} />)}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cartera</h1>
          <p className="text-sm text-gray-500">Pendientes, vencidos y pagados (front-first).</p>
        </div>
        <a href="/pagos/registrar" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <DollarSign className="h-4 w-4" /> Registrar pago
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total pendiente</p>
          <p className="text-2xl font-black text-gray-900">{money.format(data.totalPendiente)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total vencido</p>
          <p className="text-2xl font-black text-gray-900">{money.format(data.totalVencido)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total pagado</p>
          <p className="text-2xl font-black text-gray-900">{money.format(data.totalPagado)}</p>
        </div>
      </div>

      <Table title="Pendientes" rows={data.pendientes} tone="bg-blue-600 hover:bg-blue-700" />
      <Table title="Vencidos" rows={data.vencidos} tone="bg-red-600 hover:bg-red-700" />
      <Table title="Pagados" rows={data.pagados} tone="bg-gray-800 hover:bg-gray-900" />
    </div>
  );
}
