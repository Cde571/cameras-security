import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getCliente } from "../../lib/services/clienteLocalService";

type Props = { clienteId: string };

export default function ClienteHistorial({ clienteId }: Props) {
  const [nombre, setNombre] = useState<string>("");

  useEffect(() => {
    const c = getCliente(clienteId);
    setNombre(c?.nombre ?? "");
  }, [clienteId]);

  // Front-first: historial “mock”. Luego lo conectamos a documentos reales.
  const historial = [
    { id: "h1", tipo: "Cotización", ref: "COT-2026-045", fecha: "2026-01-18", href: "/cotizaciones" },
    { id: "h2", tipo: "Cuenta de cobro", ref: "CC-2026-089", fecha: "2026-01-17", href: "/cobros" },
    { id: "h3", tipo: "Orden", ref: "OT-2026-123", fecha: "2026-01-16", href: "/ordenes" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Historial</h1>
          <p className="text-sm text-gray-500">{nombre ? `Cliente: ${nombre}` : `ID: ${clienteId}`}</p>
        </div>
        <a
          href={`/clientes/${clienteId}`}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </a>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-semibold text-gray-700">Movimientos recientes</p>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Tipo</th>
              <th className="px-5 py-3 text-left font-semibold">Referencia</th>
              <th className="px-5 py-3 text-left font-semibold">Fecha</th>
              <th className="px-5 py-3 text-right font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {historial.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">{h.tipo}</td>
                <td className="px-5 py-3 font-semibold text-gray-900">{h.ref}</td>
                <td className="px-5 py-3 text-gray-700">{h.fecha}</td>
                <td className="px-5 py-3 text-right">
                  <a className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50" href={h.href}>
                    Ver
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-5 py-3 text-xs text-gray-500">
          Nota: este historial es temporal (front-first). Luego lo conectamos a cotizaciones/cobros/órdenes reales del cliente.
        </div>
      </div>
    </div>
  );
}
