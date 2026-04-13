import React from "react";
import { getReporteDashboard } from "../../lib/services/reporteLocalService";
import TopClientes from "./TopClientes";

export default function ReporteClientes() {
  const d = getReporteDashboard();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <p className="text-sm text-gray-500">Top clientes (mock).</p>
      </header>
      <TopClientes data={d.topClientes} />
    </div>
  );
}
