import React, { useEffect, useState } from "react";
import type { ClienteHistorialData } from "../../types/clienteHistorial";
import { exportClienteJson, getClienteHistorial } from "../../lib/services/clienteHistorialService";

type Props = {
  clienteId: string;
};

const emptyData: ClienteHistorialData = {
  cliente: null,
  resumen: {
    cotizaciones: 0,
    ordenes: 0,
    cobros: 0,
    pagos: 0,
    totalCotizado: 0,
    totalCobrado: 0,
    totalPagado: 0,
    saldoPendiente: 0,
  },
  documentos: [],
};

function currency(value: number) {
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$ ${value}`;
  }
}

export default function ClienteHistorialReal({ clienteId }: Props) {
  const [data, setData] = useState<ClienteHistorialData>(emptyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const result = await getClienteHistorial(clienteId);
        if (active) setData(result);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [clienteId]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Historial del cliente</h2>
          <p className="mt-1 text-sm text-slate-500">
            Relación real de documentos y movimientos asociados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportClienteJson(clienteId)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Exportar JSON
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Cotizaciones</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{data.resumen.cotizaciones}</p>
          <p className="mt-2 text-xs text-slate-500">{currency(data.resumen.totalCotizado)}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Órdenes</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{data.resumen.ordenes}</p>
          <p className="mt-2 text-xs text-slate-500">Seguimiento operativo</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Cobrado</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{currency(data.resumen.totalCobrado)}</p>
          <p className="mt-2 text-xs text-slate-500">{data.resumen.cobros} cuenta(s) de cobro</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Saldo pendiente</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{currency(data.resumen.saldoPendiente)}</p>
          <p className="mt-2 text-xs text-slate-500">{data.resumen.pagos} pago(s) registrados</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Documentos relacionados</h3>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-sm text-slate-500">Cargando historial...</div>
        ) : data.documentos.length === 0 ? (
          <div className="px-6 py-8 text-sm text-slate-500">Este cliente aún no tiene documentos relacionados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Valor</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.documentos.map((doc) => (
                  <tr key={`${doc.tipo}-${doc.id}`} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm capitalize text-slate-700">{doc.tipo}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{doc.numero}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{doc.fecha}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{doc.estado}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{currency(doc.total)}</td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={doc.href}
                        className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                      >
                        Ver detalle
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
