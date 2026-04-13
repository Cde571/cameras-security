import React from "react";
import { Download } from "lucide-react";
import { exportVentasCSV } from "../../lib/services/reporteLocalService";

function downloadText(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButtons() {
  return (
    <button
      onClick={() => downloadText("reporte_ventas.csv", exportVentasCSV(), "text/csv")}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
    >
      <Download className="h-4 w-4" />
      Exportar Ventas (CSV)
    </button>
  );
}
