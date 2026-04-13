import React from "react";

// Placeholder front-first para "Activos" (cámaras/equipos instalados).
// Luego lo conectamos con Productos/Kits y números de serie.
export default function ActivosTable() {
  const data = [
    { id: "a1", nombre: "Cámara IP 4MP", serial: "—", ubicacion: "Entrada" },
    { id: "a2", nombre: "NVR 16ch", serial: "—", ubicacion: "Cuarto técnico" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-3">
        <p className="text-sm font-semibold text-gray-800">Activos instalados (mock)</p>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-5 py-3 text-left font-semibold">Activo</th>
            <th className="px-5 py-3 text-left font-semibold">Serial</th>
            <th className="px-5 py-3 text-left font-semibold">Ubicación</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-semibold text-gray-900">{a.nombre}</td>
              <td className="px-5 py-3 text-gray-700">{a.serial}</td>
              <td className="px-5 py-3 text-gray-700">{a.ubicacion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-5 py-3 text-xs text-gray-500">
        Luego: seriales reales, garantía, mantenimientos y ubicación exacta.
      </div>
    </div>
  );
}
