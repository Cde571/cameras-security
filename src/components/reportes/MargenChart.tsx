import React, { useEffect, useMemo, useState } from "react";
import { getReporteMargenes, type ReporteMargenItem } from "../../lib/repositories/reporteRepo";

type Props = {
  title?: string;
  data?: ReporteMargenItem[];
};

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function MargenChart({ title = "Márgenes", data }: Props) {
  const [remoteData, setRemoteData] = useState<ReporteMargenItem[]>(Array.isArray(data) ? data : []);
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
        const rows = await getReporteMargenes();
        if (!cancelled) setRemoteData(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Error cargando reporte de márgenes:", error);
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
  const totalRevenue = useMemo(() => safeData.reduce((acc, m) => acc + Number(m.revenue || 0), 0), [safeData]);
  const totalCost = useMemo(() => safeData.reduce((acc, m) => acc + Number(m.cost || 0), 0), [safeData]);
  const totalProfit = useMemo(() => safeData.reduce((acc, m) => acc + Number(m.profit || 0), 0), [safeData]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Margen por categoría según costos y precios/ventas disponibles.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-5">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Ingreso</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{money(totalRevenue)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Costo</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{money(totalCost)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Utilidad</p>
          <p className="mt-2 text-xl font-semibold text-green-700">{money(totalProfit)}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Cargando márgenes...
        </div>
      ) : safeData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No hay datos de márgenes para mostrar.
        </div>
      ) : (
        <div className="space-y-3">
          {safeData.map((m, idx) => (
            <div key={`${m.category}-${idx}`} className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">{m.category}</p>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                  {m.marginPct}%
                </span>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                <div>Ingreso: <b className="text-gray-900">{money(m.revenue)}</b></div>
                <div>Costo: <b className="text-gray-900">{money(m.cost)}</b></div>
                <div>Utilidad: <b className="text-gray-900">{money(m.profit)}</b></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}