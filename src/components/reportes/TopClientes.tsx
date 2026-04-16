import React from "react";
import type { TopItem } from "../../lib/repositories/reporteRepo";

function money(n: number) {
  try { return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }); }
  catch { return `$ ${Math.round(n)}`; }
}

export default function TopClientes({ data }: { data: TopItem[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Top Clientes</h3>
      <p className="text-xs text-gray-500 mt-1">Por total (mock).</p>

      <div className="mt-4 space-y-3">
        {data.map((c, idx) => (
          <div key={c.name} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{idx + 1}. {c.name}</p>
              <p className="text-xs text-gray-500">{c.count} documentos</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{money(c.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

