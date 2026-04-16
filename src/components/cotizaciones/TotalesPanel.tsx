import React, { useMemo } from "react";
import { calcTotales, type CotizacionItem } from "../../lib/repositories/cotizacionRepo";

type Props = { items: CotizacionItem[] };

function money(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);
}

export default function TotalesPanel({ items }: Props) {
  const t = useMemo(() => calcTotales(items), [items]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
      <h3 className="font-semibold text-gray-900">Totales</h3>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold text-gray-900">{money(t.subtotal)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">IVA</span>
        <span className="font-semibold text-gray-900">{money(t.iva)}</span>
      </div>

      <div className="border-t border-gray-200 pt-2 flex justify-between">
        <span className="text-gray-800 font-semibold">Total</span>
        <span className="text-gray-900 font-bold">{money(t.total)}</span>
      </div>
    </div>
  );
}

