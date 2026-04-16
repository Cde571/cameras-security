import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getCliente,
  listActas,
  listCobros,
  listCotizaciones,
  listOrdenes,
  listPagos,
} from "../../lib/flow/data";

type Props = { clienteId: string };

type Movimiento = {
  id: string;
  tipo: string;
  ref: string;
  fecha: string;
  href: string;
  valor?: number;
};

function toTime(value?: string) {
  if (!value) return 0;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

export default function ClienteHistorial({ clienteId }: Props) {
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const rerender = () => setRefresh((v) => v + 1);
    window.addEventListener("storage", rerender);
    window.addEventListener("focus", rerender);
    return () => {
      window.removeEventListener("storage", rerender);
      window.removeEventListener("focus", rerender);
    };
  }, []);

  const cliente = useMemo(() => getCliente(clienteId), [clienteId, refresh]);

  const historial = useMemo<Movimiento[]>(() => {
    const cotizaciones = listCotizaciones("")
      .filter((x) => x.clienteId === clienteId)
      .map((x) => ({
        id: `cot_${x.id}`,
        tipo: "Cotización",
        ref: x.numero,
        fecha: x.fecha || x.updatedAt,
        href: `/cotizaciones/${x.id}`,
      }));

    const ordenes = listOrdenes("")
      .filter((x) => x.clienteId === clienteId)
      .map((x) => ({
        id: `ord_${x.id}`,
        tipo: "Orden",
        ref: x.numero,
        fecha: x.fechaProgramada || x.fechaCreacion || x.updatedAt,
        href: `/ordenes/${x.id}`,
      }));

    const actas = listActas("")
      .filter((x) => x.clienteId === clienteId)
      .map((x) => ({
        id: `act_${x.id}`,
        tipo: "Acta",
        ref: x.numero,
        fecha: x.fecha || x.updatedAt,
        href: `/actas/${x.id}`,
      }));

    const cobros = listCobros("")
      .filter((x) => x.clienteId === clienteId)
      .map((x) => ({
        id: `cc_${x.id}`,
        tipo: "Cuenta de cobro",
        ref: x.numero,
        fecha: x.fechaEmision || x.updatedAt,
        href: `/cobros/${x.id}`,
        valor: Number(x.total || 0),
      }));

    const pagos = listPagos("")
      .filter((x) => x.clienteId === clienteId)
      .map((x, idx) => ({
        id: `pay_${x.id}`,
        tipo: "Pago",
        ref: x.referencia?.trim() || `PAGO-${String(idx + 1).padStart(3, "0")}`,
        fecha: x.fecha || x.updatedAt,
        href: x.cobroId ? `/cobros/${x.cobroId}` : `/pagos/estado-cuenta/${clienteId}`,
        valor: Number(x.valor || 0),
      }));

    return [...cotizaciones, ...ordenes, ...actas, ...cobros, ...pagos]
      .sort((a, b) => toTime(b.fecha) - toTime(a.fecha));
  }, [clienteId, refresh]);

  const money = useMemo(
    () =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }),
    []
  );

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Historial</h1>
          <p className="text-sm text-gray-500">
            {cliente?.nombre ? `Cliente: ${cliente.nombre}` : `ID: ${clienteId}`}
          </p>
        </div>
        <a
          href={`/clientes/${clienteId}`}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </a>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-sm font-semibold text-gray-700">Movimientos reales del cliente</p>
        </div>

        {historial.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            Este cliente todavía no tiene cotizaciones, órdenes, actas, cobros o pagos registrados.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Tipo</th>
                <th className="px-5 py-3 text-left font-semibold">Referencia</th>
                <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                <th className="px-5 py-3 text-right font-semibold">Valor</th>
                <th className="px-5 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historial.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">{h.tipo}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">{h.ref}</td>
                  <td className="px-5 py-3 text-gray-700">{h.fecha || "—"}</td>
                  <td className="px-5 py-3 text-right text-gray-700">
                    {typeof h.valor === "number" ? money.format(h.valor) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <a className="rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50" href={h.href}>
                      Ver
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="px-5 py-3 text-xs text-gray-500">
          El historial ya toma documentos reales del cliente y los ordena por fecha más reciente.
        </div>
      </div>
    </div>
  );
}
