import React from "react";

type ProductoLike = {
  id?: string;
  nombre?: string;
  categoria?: string;
  precio?: number;
  stock?: number;
  marca?: string;
  descripcion?: string;
};

function money(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default function ProductoCard({ producto }: { producto: ProductoLike }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{producto.nombre || "Producto"}</h3>
        <p className="text-sm text-gray-500">
          {[producto.marca, producto.categoria].filter(Boolean).join(" • ") || "Sin categoría"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-500">Precio</p>
          <p className="font-semibold text-gray-900">{money(producto.precio || 0)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-500">Stock</p>
          <p className="font-semibold text-gray-900">{producto.stock ?? 0}</p>
        </div>
      </div>

      {producto.descripcion ? (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{producto.descripcion}</p>
      ) : null}
    </div>
  );
}
