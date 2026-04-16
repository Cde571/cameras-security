import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import { getCuentaCobro } from "../../lib/repositories/cobroRepo";

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function CuentaDetail({ cobroId }: { cobroId: string }) {
  const [cuenta, setCuenta] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCuenta() {
      try {
        setLoading(true);
        const data = await getCuentaCobro(cobroId);
        if (!cancelled) setCuenta(data || null);
      } catch (error) {
        console.error("Error cargando cuenta de cobro:", error);
        if (!cancelled) setCuenta(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCuenta();
    return () => {
      cancelled = true;
    };
  }, [cobroId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando cuenta de cobro...</p>
      </div>
    );
  }

  if (!cuenta) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cuenta de cobro no encontrada.</p>
        <a
          href="/cobros"
          className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
        >
          Volver
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{cuenta.numero}</h1>
          <p className="text-sm text-gray-500">
            Estado: {cuenta.status} · Emisión: {cuenta.fechaEmision || "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/cobros"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <a
            href={`/cobros/${cuenta.id}/editar`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </a>

          <a
            href={`/cobros/${cuenta.id}/pdf`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            <FileText className="h-4 w-4" />
            PDF
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Datos generales</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-gray-500">Cliente</p>
                <p className="mt-1 text-sm text-gray-800">{cuenta.cliente?.nombre || "—"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Documento</p>
                <p className="mt-1 text-sm text-gray-800">{cuenta.cliente?.documento || "—"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Emisión</p>
                <p className="mt-1 text-sm text-gray-800">{cuenta.fechaEmision || "—"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Vencimiento</p>
                <p className="mt-1 text-sm text-gray-800">{cuenta.fechaVencimiento || "—"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Estado</p>
                <p className="mt-1 text-sm text-gray-800">{cuenta.status || "pendiente"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Servicios</h2>

            {Array.isArray(cuenta.items) && cuenta.items.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Descripción</th>
                      <th className="px-4 py-3 text-left font-semibold">Cantidad</th>
                      <th className="px-4 py-3 text-left font-semibold">Valor unitario</th>
                      <th className="px-4 py-3 text-left font-semibold">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {cuenta.items.map((item: any) => (
                      <tr key={item.id || item.descripcion}>
                        <td className="px-4 py-3">{item.descripcion}</td>
                        <td className="px-4 py-3">{item.cantidad}</td>
                        <td className="px-4 py-3">{money(item.valorUnitario)}</td>
                        <td className="px-4 py-3">{money(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay servicios registrados.</p>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Observaciones</h2>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {cuenta.observaciones || "Sin observaciones."}
            </p>
          </section>
        </div>

        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Totales</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{money(cuenta.subtotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">IVA</span>
              <span className="font-medium text-gray-900">{money(cuenta.iva)}</span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="text-lg font-semibold text-gray-900">{money(cuenta.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}