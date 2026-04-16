import React, { useEffect, useState } from "react";
import { ArrowLeft, Pencil, FileText } from "lucide-react";
import { getCotizacion } from "../../lib/repositories/cotizacionRepo";

type Props = {
  cotizacionId: string;
};

export default function CotizacionDetail({ cotizacionId }: Props) {
  const [loading, setLoading] = useState(true);
  const [cotizacion, setCotizacion] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCotizacion() {
      try {
        setLoading(true);
        const data = await getCotizacion(cotizacionId);

        if (!cancelled) {
          setCotizacion(data || null);
        }
      } catch (error) {
        console.error("Error cargando cotización:", error);
        if (!cancelled) setCotizacion(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (cotizacionId) {
      loadCotizacion();
    } else {
      setLoading(false);
      setCotizacion(null);
    }

    return () => {
      cancelled = true;
    };
  }, [cotizacionId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando cotización...</p>
      </div>
    );
  }

  if (!cotizacion) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cotización no encontrada.</p>
        <a
          href="/cotizaciones"
          className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
        >
          Volver
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{cotizacion.numero}</h1>
          <p className="text-sm text-gray-500">
            Estado: {cotizacion.status || "borrador"} · Fecha: {cotizacion.fecha || "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/cotizaciones"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <a
            href={`/cotizaciones/${cotizacion.id}/editar`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </a>

          <a
            href={`/cotizaciones/${cotizacion.id}/pdf`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FileText className="h-4 w-4" />
            PDF
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-gray-900">Información general</h2>

          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-gray-500">Cliente</p>
              <p className="text-gray-800">{cotizacion.cliente?.nombre || cotizacion.clienteNombre || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">Vigencia</p>
              <p className="text-gray-800">{cotizacion.vigenciaDias || 30} días</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">Asunto</p>
              <p className="text-gray-800">{cotizacion.asunto || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">Estado</p>
              <p className="text-gray-800">{cotizacion.status || "borrador"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500">Condiciones</p>
            <p className="whitespace-pre-wrap text-sm text-gray-700">{cotizacion.condiciones || "—"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500">Notas</p>
            <p className="whitespace-pre-wrap text-sm text-gray-700">{cotizacion.notas || "—"}</p>
          </div>
        </section>

        <aside className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Totales</h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-800">
                ${Number(cotizacion.subtotal || 0).toLocaleString("es-CO")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">IVA</span>
              <span className="font-medium text-gray-800">
                ${Number(cotizacion.iva || 0).toLocaleString("es-CO")}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-semibold text-gray-900">
                ${Number(cotizacion.total || 0).toLocaleString("es-CO")}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}