import React from "react";
import { getReporteDashboard } from "../../lib/services/reporteLocalService";
import MargenChart from "./MargenChart";

export default function ReporteMargenes() {
  const d = getReporteDashboard();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Márgenes</h1>
        <p className="text-sm text-gray-500">Márgenes por categoría (mock).</p>
      </header>
      <MargenChart data={d.margenes} />
    </div>
  );
}
