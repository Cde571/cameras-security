import React from "react";
import type { VentaMensual } from "../../lib/services/reporteLocalService";

function money(n: number) {
  try { return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }); }
  catch { return `$ ${Math.round(n)}`; }
}

export default function VentasChart({ data, title }: { data: VentaMensual[]; title: string }) {
  const max = Math.max(...data.map(d => d.total), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">Vista rápida (mock front-first).</p>

      <div className="mt-4 space-y-2">
        {data.map((d) => {
          const w = Math.round((d.total / max) * 100);
          return (
            <div key={d.month} className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-1 text-xs text-gray-600">{d.month}</div>
              <div className="col-span-8">
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-3 rounded-full bg-blue-600" style={{ width: `${w}%` }} />
                </div>
              </div>
              <div className="col-span-3 text-right text-xs font-semibold text-gray-800">
                {money(d.total)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
