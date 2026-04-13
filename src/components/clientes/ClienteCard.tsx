import React, { useEffect, useState } from "react";
import { Pencil, History, FileText, DollarSign, Wrench } from "lucide-react";
import { getCliente, type Cliente } from "../../lib/services/clienteLocalService";

type Props = { clienteId: string };

export default function ClienteCard({ clienteId }: Props) {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    setCliente(getCliente(clienteId));
  }, [clienteId]);

  if (!cliente) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cliente no encontrado.</p>
        <a className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/clientes">
          Volver a clientes
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{cliente.nombre}</h1>
          <p className="text-sm text-gray-500">{cliente.documento || "—"}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`/clientes/${clienteId}/editar`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </a>
          <a
            href={`/clientes/${clienteId}/historial`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
          >
            <History className="h-4 w-4" />
            Historial
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900">Información</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-500">Teléfono</p>
              <p className="text-gray-800">{cliente.telefono || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Email</p>
              <p className="text-gray-800">{cliente.email || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Dirección</p>
              <p className="text-gray-800">{cliente.direccion || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Ciudad</p>
              <p className="text-gray-800">{cliente.ciudad || "—"}</p>
            </div>
          </div>

          {cliente.notas ? (
            <div className="pt-2">
              <p className="text-xs font-semibold text-gray-500">Notas</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{cliente.notas}</p>
            </div>
          ) : null}
        </section>

        <aside className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-900">Acciones</h2>

          <a
            href="/cotizaciones/nueva"
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm"
          >
            <FileText className="h-4 w-4 text-gray-700" />
            Nueva cotización
          </a>
          <a
            href="/cobros/nueva"
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm"
          >
            <DollarSign className="h-4 w-4 text-gray-700" />
            Nueva cuenta de cobro
          </a>
          <a
            href="/ordenes/nueva"
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 text-sm"
          >
            <Wrench className="h-4 w-4 text-gray-700" />
            Nueva orden de trabajo
          </a>
        </aside>
      </div>
    </div>
  );
}
