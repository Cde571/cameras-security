import React from "react";
import type { MargenItem } from "../../lib/services/reporteLocalService";

function money(n: number) {
  try { return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }); }
  catch { return `$ ${Math.round(n)}`; }
}

export default function MargenChart({ data }: { data: MargenItem[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Márgenes</h3>
      <p className="text-xs text-gray-500 mt-1">Por categoría (mock).</p>

      <div className="mt-4 space-y-3">
        {data.map((m) => (
          <div key={m.category} className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900">{m.category}</p>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                {m.marginPct}%
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div>Ingreso: <b className="text-gray-900">{money(m.revenue)}</b></div>
              <div>Costo: <b className="text-gray-900">{money(m.cost)}</b></div>
              <div>Margen: <b className="text-gray-900">{money(m.margin)}</b></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
