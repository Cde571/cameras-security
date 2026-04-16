import React from "react";
import { getReporteDashboard } from "../../lib/repositories/reporteRepo";
import VentasChart from "./VentasChart";

export default function ReporteVentas() {
  const d = getReporteDashboard();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
        <p className="text-sm text-gray-500">Resumen mensual (mock).</p>
      </header>
      <VentasChart data={d.ventasMensuales} title="Ventas por mes" />
    </div>
  );
}

