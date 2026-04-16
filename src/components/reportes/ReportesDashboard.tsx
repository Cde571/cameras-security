import React from "react";
import { getReporteDashboard } from "../../lib/repositories/reporteRepo";
import VentasChart from "./VentasChart";
import TopProductos from "./TopProductos";
import TopClientes from "./TopClientes";
import MargenChart from "./MargenChart";

function money(n: number) {
  try { return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }); }
  catch { return `$ ${Math.round(n)}`; }
}

export default function ReportesDashboard() {
  const d = getReporteDashboard();

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Resumen</h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Total ventas</p>
              <p className="text-lg font-bold text-gray-900">{money(d.kpis.totalVentas)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Total documentos</p>
              <p className="text-lg font-bold text-gray-900">{d.kpis.totalDocumentos}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Margen promedio</p>
              <p className="text-lg font-bold text-gray-900">{d.kpis.margenPromedioPct}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VentasChart data={d.ventasMensuales} title="Ventas (últimos 12 meses)" />
        </div>
        <MargenChart data={d.margenes} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductos data={d.topProductos} />
        <TopClientes data={d.topClientes} />
      </section>
    </div>
  );
}

