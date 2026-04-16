import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText, Pencil, GitBranch, Trash2, Wrench, DollarSign } from "lucide-react";
import { calcTotales, deleteCotizacion, getCotizacion, type Cotizacion } from "../../lib/flow/data";
import { buildFlowUrl } from "../../lib/flow/context";

function money(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

export default function CotizacionDetail({ cotizacionId }: { cotizacionId: string }) {
  const [c, setC] = useState<Cotizacion | null>(null);

  useEffect(() => {
    setC(getCotizacion(cotizacionId));
  }, [cotizacionId]);

  const t = useMemo(() => (c ? calcTotales(c.items || []) : { subtotal: 0, iva: 0, total: 0 }), [c]);

  const links = useMemo(() => {
    if (!c) return { orden: "/ordenes/nueva", cobro: "/cobros/nueva" };
    return {
      orden: buildFlowUrl("/ordenes/nueva", { clienteId: c.clienteId, cotizacionId: c.id, from: "cotizacion" }),
      cobro: buildFlowUrl("/cobros/nueva", { clienteId: c.clienteId, cotizacionId: c.id, from: "cotizacion" }),
    };
  }, [c]);

  const del = () => {
    if (!c) return;
    const ok = confirm("¿Eliminar esta cotización?");
    if (!ok) return;
    deleteCotizacion(c.id);
    window.location.href = "/cotizaciones";
  };

  if (!c) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cotización no encontrada.</p>
        <a className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/cotizaciones">
          Volver
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{c.numero}</h1>
          <p className="text-sm text-gray-500">
            v{c.version} • {c.status} • {c.fecha} • Vigencia {c.vigenciaDias} días
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href="/cotizaciones" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Volver
          </a>
          <a href={`/cotizaciones/${c.id}/editar`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Pencil className="h-4 w-4" /> Editar
          </a>
          <a href={links.orden} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            <Wrench className="h-4 w-4" /> Crear orden
          </a>
          <a href={links.cobro} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800 hover:bg-emerald-100">
            <DollarSign className="h-4 w-4" /> Crear cobro
          </a>
          <a href={`/cotizaciones/${c.id}/pdf`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <FileText className="h-4 w-4" /> PDF
          </a>
          <a href={`/cotizaciones/${c.id}/versionar`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <GitBranch className="h-4 w-4" /> Versionar
          </a>
          <button onClick={del} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <Trash2 className="h-4 w-4 text-red-600" /> Eliminar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div>
            <p className="text-xs font-semibold text-gray-500">Cliente</p>
            <p className="font-semibold text-gray-900">{c.cliente?.nombre}</p>
            <p className="text-sm text-gray-600">
              {c.cliente?.documento || ""} {c.cliente?.ciudad ? `• ${c.cliente.ciudad}` : ""}
            </p>
          </div>

          {c.asunto ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Asunto</p>
              <p className="text-gray-800">{c.asunto}</p>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Ítem</th>
                  <th className="px-4 py-3 text-right font-semibold">Cant</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {c.items.map((it) => {
                  const base = it.precio * it.qty;
                  const iva = base * (it.ivaPct / 100);
                  return (
                    <tr key={it.id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{it.nombre}</div>
                        <div className="text-xs text-gray-500">{it.kind} • IVA {it.ivaPct}%</div>
                      </td>
                      <td className="px-4 py-3 text-right">{it.qty}</td>
                      <td className="px-4 py-3 text-right font-semibold">{money(base + iva)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {c.condiciones ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Condiciones</p>
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{c.condiciones}</pre>
            </div>
          ) : null}

          {c.notas ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Notas</p>
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{c.notas}</pre>
            </div>
          ) : null}
        </section>

        <aside className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Totales</h3>
          <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-semibold">{money(t.subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-600">IVA</span><span className="font-semibold">{money(t.iva)}</span></div>
          <div className="flex justify-between border-t border-gray-200 pt-2"><span className="font-semibold">Total</span><span className="font-bold">{money(t.total)}</span></div>

          <div className="border-t border-gray-200 pt-3 space-y-2">
            <p className="text-xs font-semibold text-gray-500">Siguiente paso</p>
            <a href={links.orden} className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              Crear orden desde esta cotización
            </a>
            <a href={links.cobro} className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              Crear cuenta de cobro desde esta cotización
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
