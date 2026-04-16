import React, { useEffect, useState } from "react";
import type { KitBase } from "../../types/productoKit";
import { exportKitJson, getKitById } from "../../lib/services/productoKitService";

type Props = {
  kitId: string;
};

function currency(value: number) {
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$ ${value}`;
  }
}

export default function KitDetailCard({ kitId }: Props) {
  const [kit, setKit] = useState<KitBase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await getKitById(kitId);
        if (active) setKit(data);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [kitId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Cargando kit...</p>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">No se encontró el kit.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{kit.nombre}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Código: {kit.codigo || "Sin código"} · {kit.activo ? "Activo" : "Inactivo"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportKitJson(kitId)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Exportar JSON
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Items</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{kit.items.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Costo total</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{currency(kit.costoTotal)}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Precio total</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{currency(kit.precioTotal)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">Productos del kit</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Costo unitario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Precio unitario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kit.items.map((item, idx) => (
                <tr key={`${item.productoId}-${idx}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">{item.nombre}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.cantidad}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{currency(item.costoUnitario)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{currency(item.precioUnitario)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {currency(item.precioUnitario * item.cantidad)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
