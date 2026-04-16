import React, { useEffect, useMemo, useState } from "react";
import { getReporteVentas, type ReporteVentaItem } from "../../lib/repositories/reporteRepo";

type Props = {
  title?: string;
  data?: ReporteVentaItem[];
};

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function VentasChart({ title = "Ventas", data }: Props) {
  const [remoteData, setRemoteData] = useState<ReporteVentaItem[]>(Array.isArray(data) ? data : []);
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
        const rows = await getReporteVentas();
        if (!cancelled) setRemoteData(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Error cargando reporte de ventas:", error);
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
  const max = useMemo(() => Math.max(...safeData.map((d) => Number(d.total || 0)), 1), [safeData]);
  const totalVentas = useMemo(() => safeData.reduce((acc, item) => acc + Number(item.total || 0), 0), [safeData]);
  const totalDocs = useMemo(() => safeData.reduce((acc, item) => acc + Number(item.cantidad || 0), 0), [safeData]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Resumen mensual de cotizaciones cerradas / registradas.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-5">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Ventas acumuladas</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{money(totalVentas)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Cantidad de cotizaciones</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{totalDocs}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Cargando ventas...
        </div>
      ) : safeData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No hay datos de ventas para mostrar.
        </div>
      ) : (
        <div className="space-y-3">
          {safeData.map((d) => {
            const width = Math.max(6, Math.round((Number(d.total || 0) / max) * 100));
            return (
              <div key={d.periodo} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{d.periodo}</span>
                  <span className="text-gray-500">{money(d.total)} · {d.cantidad} doc(s)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100">
                  <div
                    className="h-3 rounded-full bg-blue-600 transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}