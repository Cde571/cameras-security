import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText, DollarSign } from "lucide-react";
import { getCobro, type CuentaCobro } from "../../lib/flow/data";
import { buildFlowUrl } from "../../lib/flow/context";

export default function CobroDetail({ cobroId }: { cobroId: string }) {
  const [cc, setCc] = useState<CuentaCobro | null>(null);

  useEffect(() => {
    setCc(getCobro(cobroId));
  }, [cobroId]);

  const money = useMemo(() => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }), []);

  const pagoLink = useMemo(() => {
    if (!cc) return "/pagos/registrar";
    return buildFlowUrl("/pagos/registrar", { clienteId: cc.clienteId, cobroId: cc.id, from: "cobro" });
  }, [cc]);

  if (!cc) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cuenta no encontrada.</p>
        <a className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/cobros">Volver</a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{cc.numero}</h1>
          <p className="text-sm text-gray-500">{cc.status} • Emisión {cc.fechaEmision} • Vence {cc.fechaVencimiento}</p>
        </div>

        <div className="flex gap-2">
          <a href="/cobros" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Volver
          </a>
          <a href={`/cobros/${cc.id}/pdf`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <FileText className="h-4 w-4" /> PDF
          </a>
          <a href={pagoLink} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <DollarSign className="h-4 w-4" /> Registrar pago
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div>
            <p className="text-xs font-semibold text-gray-500">Cliente</p>
            <p className="font-semibold text-gray-900">{cc.cliente?.nombre}</p>
            <p className="text-sm text-gray-600">{cc.cliente?.documento || ""} {cc.cliente?.ciudad ? `• ${cc.cliente.ciudad}` : ""}</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Servicio</th>
                  <th className="px-5 py-3 text-right font-semibold">Cant</th>
                  <th className="px-5 py-3 text-right font-semibold">Unit</th>
                  <th className="px-5 py-3 text-right font-semibold">IVA%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cc.servicios.map((s) => (
                  <tr key={s.id}>
                    <td className="px-5 py-3">{s.descripcion}</td>
                    <td className="px-5 py-3 text-right">{s.cantidad}</td>
                    <td className="px-5 py-3 text-right">{money.format(s.unitario)}</td>
                    <td className="px-5 py-3 text-right">{s.ivaPct ?? 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cc.observaciones ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Observaciones</p>
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{cc.observaciones}</pre>
            </div>
          ) : null}
        </section>

        <aside className="space-y-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Totales</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{money.format(cc.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">IVA</span>
            <span className="font-semibold">{money.format(cc.iva)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-2">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-black text-gray-900">{money.format(cc.total)}</span>
          </div>

          <div className="space-y-2 border-t border-gray-200 pt-3">
            <a className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50" href={pagoLink}>
              Registrar pago de este cobro
            </a>
            <a className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50" href={`/pagos/estado-cuenta/${cc.clienteId}`}>
              Ver estado de cuenta del cliente
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
