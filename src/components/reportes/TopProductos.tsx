import React, { useEffect, useMemo, useState } from "react";
import { getReporteProductos, type ReporteProductoItem } from "../../lib/repositories/reporteRepo";

type Props = {
  title?: string;
  data?: ReporteProductoItem[];
};

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function TopProductos({ title = "Top productos", data }: Props) {
  const [remoteData, setRemoteData] = useState<ReporteProductoItem[]>(Array.isArray(data) ? data : []);
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
        const rows = await getReporteProductos();
        if (!cancelled) setRemoteData(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Error cargando reporte de productos:", error);
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
  const totalMonto = useMemo(() => safeData.reduce((acc, p) => acc + Number(p.total || 0), 0), [safeData]);
  const totalVentas = useMemo(() => safeData.reduce((acc, p) => acc + Number(p.count || 0), 0), [safeData]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">Productos más vendidos según ítems de cotización.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-5">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Monto acumulado</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{money(totalMonto)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500">Ventas contabilizadas</p>
          <p className="mt-2 text-xl font-semibold text-gray-900">{totalVentas}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Cargando productos...
        </div>
      ) : safeData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No hay datos de productos para mostrar.
        </div>
      ) : (
        <div className="space-y-3">
          {safeData.map((p, idx) => (
            <div key={`${p.name}-${idx}`} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{idx + 1}. {p.name}</p>
                <p className="text-xs text-gray-500">{p.count} venta(s)</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{money(p.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}