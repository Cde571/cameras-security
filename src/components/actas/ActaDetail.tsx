import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { getActa, type ActaEntrega } from "../../lib/services/actaLocalService";

export default function ActaDetail({ actaId }: { actaId: string }) {
  const [acta, setActa] = useState<ActaEntrega | null>(null);

  useEffect(() => {
    setActa(getActa(actaId));
  }, [actaId]);

  const count = useMemo(() => acta?.activos?.reduce((a, x) => a + (x.cantidad || 0), 0) ?? 0, [acta]);

  if (!acta) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Acta no encontrada.</p>
        <a className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50" href="/actas">Volver</a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{acta.numero}</h1>
          <p className="text-sm text-gray-500">{acta.status} • {acta.fecha} • {acta.cliente?.nombre}</p>
        </div>

        <div className="flex gap-2">
          <a href="/actas" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Volver
          </a>
          <a href={`/actas/${acta.id}/pdf`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
            <FileText className="h-4 w-4" /> PDF
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500">Cliente</p>
            <p className="font-semibold text-gray-900">{acta.cliente?.nombre}</p>
            <p className="text-sm text-gray-600">{acta.cliente?.documento || ""} {acta.lugar ? `• ${acta.lugar}` : ""}</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Tipo</th>
                  <th className="px-5 py-3 text-left font-semibold">Descripción</th>
                  <th className="px-5 py-3 text-right font-semibold">Cant</th>
                  <th className="px-5 py-3 text-left font-semibold">Serial</th>
                  <th className="px-5 py-3 text-left font-semibold">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {acta.activos.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">{a.tipo}</td>
                    <td className="px-5 py-3">{a.descripcion}</td>
                    <td className="px-5 py-3 text-right font-semibold">{a.cantidad}</td>
                    <td className="px-5 py-3">{a.serial || "—"}</td>
                    <td className="px-5 py-3">{a.ubicacion || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {acta.observaciones ? (
            <div>
              <p className="text-xs font-semibold text-gray-500">Observaciones</p>
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{acta.observaciones}</pre>
            </div>
          ) : null}
        </section>

        <aside className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500">Resumen</p>
            <p className="text-sm text-gray-700">Ítems entregados: <b>{count}</b></p>
            <p className="text-sm text-gray-700">Técnico: <b>{acta.responsables?.tecnico || "—"}</b></p>
            <p className="text-sm text-gray-700">Recibe: <b>{acta.responsables?.clienteRecibe || "—"}</b></p>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2">Firma</p>
            {acta.firmaClienteDataUrl ? (
              <img src={acta.firmaClienteDataUrl} alt="Firma" className="w-full rounded-lg border border-gray-200 bg-white" />
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                Sin firma registrada
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
