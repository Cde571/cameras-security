import React, { useEffect, useMemo, useState } from "react";
import { Pencil, History, FileText, DollarSign, Wrench } from "lucide-react";
import { getCliente, type Cliente } from "../../lib/flow/data";
import { buildFlowUrl } from "../../lib/flow/context";

type Props = { clienteId: string };

export default function ClienteCard({ clienteId }: Props) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await getCliente(clienteId);
        if (!cancelled) {
          setCliente(data);
        }
      } catch (error) {
        console.error("Error cargando cliente:", error);
        if (!cancelled) setCliente(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [clienteId]);

  const links = useMemo(() => ({
    cotizacion: buildFlowUrl("/cotizaciones/nueva", { clienteId, from: "cliente" }),
    cobro: buildFlowUrl("/cobros/nueva", { clienteId, from: "cliente" }),
    orden: buildFlowUrl("/ordenes/nueva", { clienteId, from: "cliente" }),
  }), [clienteId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando cliente...</p>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-gray-900">Información</h2>

          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
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
              <p className="whitespace-pre-wrap text-sm text-gray-700">{cliente.notas}</p>
            </div>
          ) : null}
        </section>

        <aside className="space-y-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">Acciones</h2>

          <a
            href={links.cotizacion}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 text-gray-700" />
            Nueva cotización
          </a>
          <a
            href={links.cobro}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            <DollarSign className="h-4 w-4 text-gray-700" />
            Nueva cuenta de cobro
          </a>
          <a
            href={links.orden}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Wrench className="h-4 w-4 text-gray-700" />
            Nueva orden de trabajo
          </a>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
            Estas acciones ya salen con el cliente preseleccionado.
          </div>
        </aside>
      </div>
    </div>
  );
}