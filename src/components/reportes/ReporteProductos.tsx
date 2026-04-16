import React from "react";
import { getReporteDashboard } from "../../lib/repositories/reporteRepo";
import TopProductos from "./TopProductos";

export default function ReporteProductos() {
  const d = getReporteDashboard();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
        <p className="text-sm text-gray-500">Top productos (mock).</p>
      </header>
      <TopProductos data={d.topProductos} />
    </div>
  );
}

