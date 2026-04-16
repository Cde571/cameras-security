import React, { useEffect, useState } from "react";
import { ArrowLeft, FileSignature, Pencil, Printer } from "lucide-react";
import { getActa } from "../../lib/repositories/actaRepo";

type Props = {
  actaId: string;
};

export default function ActaDetail({ actaId }: Props) {
  const [loading, setLoading] = useState(true);
  const [acta, setActa] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadActa() {
      try {
        setLoading(true);
        const data = await getActa(actaId);

        if (!cancelled) {
          setActa(data || null);
        }
      } catch (error) {
        console.error("Error cargando acta:", error);
        if (!cancelled) setActa(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (actaId) {
      loadActa();
    } else {
      setLoading(false);
      setActa(null);
    }

    return () => {
      cancelled = true;
    };
  }, [actaId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cargando acta...</p>
      </div>
    );
  }

  if (!acta) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Acta no encontrada.</p>
        <a
          href="/actas"
          className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
        >
          Volver
        </a>
      </div>
    );
  }

  const firma = typeof acta.firmaDataUrl === "string" ? acta.firmaDataUrl : "";
  const tieneFirma = firma.startsWith("data:image/");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{acta.numero || "Acta"}</h1>
          <p className="text-sm text-gray-500">
            Estado: {acta.status || "borrador"} · Fecha: {acta.fecha || "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href="/actas"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <a
            href={`/actas/${acta.id}/editar`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </a>

          <a
            href={`/actas/${acta.id}/pdf`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            PDF
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Datos generales</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-gray-500">Cliente</p>
                <p className="mt-1 text-sm text-gray-800">{acta.cliente?.nombre || "—"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Documento</p>
                <p className="mt-1 text-sm text-gray-800">{acta.cliente?.documento || "—"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Fecha</p>
                <p className="mt-1 text-sm text-gray-800">{acta.fecha || "—"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Lugar</p>
                <p className="mt-1 text-sm text-gray-800">{acta.lugar || "—"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Estado</p>
                <p className="mt-1 text-sm text-gray-800">{acta.status || "borrador"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500">Creada</p>
                <p className="mt-1 text-sm text-gray-800">{acta.createdAt || "—"}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Observaciones</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
{acta.observaciones || "Sin observaciones."}
            </pre>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Firma</h2>
            </div>

            {tieneFirma ? (
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <img
                  src={firma}
                  alt="Firma del acta"
                  className="block w-full rounded-lg border border-dashed border-gray-300 bg-white"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                Esta acta no tiene firma registrada.
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}