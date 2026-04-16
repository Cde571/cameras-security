import React, { useEffect, useMemo, useState } from "react";
import { getReporteClientes, type ReporteClienteItem } from "../../lib/repositories/reporteRepo";

type Props = {
  title?: string;
  data?: ReporteClienteItem[];
};

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function TopClientes({ title = "Top clientes", data }: Props) {
  const [remoteData, setRemoteData] = useState<ReporteClienteItem[]>(Array.isArray(data) ? data : []);
  const [loading, setLoading] = useState(!Array.isArray(data));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (Array.isArray(data)) {
        setRemoteData(data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const rows = await getReporteClientes();
        if (!cancelled) setRemoteData(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Error cargando reporte de clientes:", error);
        if (!cancelled) setRemoteData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [data]);

  const safeData = useMemo(() => (Array.isArray(remoteData) ? remoteData : []), [remoteData]);
  const totalMonto = useMemo(() => safeData.reduce((acc, c) => acc + Number(c.total || 0), 0), [safeData]);
  const totalDocs = useMemo(() => safeData.reduce((acc, c) => acc + Number(c.count || 0), 0), [safeData]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Clientes con mayor movimiento en cotizaciones.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-5">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Monto acumulado</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{money(totalMonto)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Documentos contabilizados</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{totalDocs}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Cargando clientes...
        </div>
      ) : safeData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No hay datos de clientes para mostrar.
        </div>
      ) : (
        <div className="space-y-3">
          {safeData.map((c, idx) => (
            <div key={`${c.name}-${idx}`} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{idx + 1}. {c.name}</p>
                <p className="text-xs text-gray-500">{c.count} documento(s)</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{money(c.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}