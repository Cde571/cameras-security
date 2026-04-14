import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { getActa, type ActaEntrega } from "../../lib/services/actaLocalService";
import { getEmpresa } from "../../lib/services/configLocalService";
import { buildActaPDF, type ActaPayload } from "../../lib/pdf/actaPDF";

function safe<T>(...values: T[]): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function mapActaToPayload(acta: any): ActaPayload {
  const cliente = acta?.cliente || {};
  const activosRaw =
    acta?.activos ||
    acta?.items ||
    acta?.equipos ||
    acta?.productos ||
    [];

  const activos = (Array.isArray(activosRaw) ? activosRaw : []).map((item: any) => ({
    id: item?.id,
    nombre: safe(item?.nombre, item?.descripcion, item?.productoNombre, "Activo") as string,
    serial: safe(item?.serial, item?.serie),
    ubicacion: safe(item?.ubicacion, item?.lugar),
    estado: safe(item?.estado, item?.condicion, "OK"),
  }));

  return {
    numero: safe(acta?.numero, acta?.consecutivo, acta?.codigo, "ACTA-S/N") as string,
    fecha: safe(acta?.fecha, acta?.fechaEntrega, acta?.createdAt, new Date().toISOString()) as string,
    cliente: {
      nombre: safe(cliente?.nombre, acta?.clienteNombre),
      documento: safe(cliente?.documento, cliente?.nit, acta?.clienteDocumento),
      telefono: safe(cliente?.telefono, acta?.clienteTelefono),
      email: safe(cliente?.email, acta?.clienteEmail),
      direccion: safe(cliente?.direccion, acta?.clienteDireccion),
      ciudad: safe(cliente?.ciudad, acta?.clienteCiudad),
    },
    proyecto: safe(acta?.proyecto, acta?.asunto, acta?.titulo),
    ordenRef: safe(acta?.ordenRef, acta?.ordenId, acta?.ordenNumero),
    activos,
    observaciones: safe(acta?.observaciones, acta?.notas),
    acuerdos: safe(acta?.acuerdos, acta?.condiciones),
  };
}

export default function PDFPreview({ actaId }: { actaId: string }) {
  const [acta, setActa] = useState<ActaEntrega | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileName = useMemo(() => {
    const base = (acta as any)?.numero || `acta-${actaId}`;
    return `${base}.pdf`;
  }, [acta, actaId]);

  async function generar(data: any) {
    setLoading(true);
    setError("");

    try {
      const empresa = getEmpresa();
      const payload = mapActaToPayload(data);
      const bytes = await buildActaPDF(payload, empresa);

      const blob = new Blob([bytes], { type: "application/pdf" });

      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err: any) {
      setError(err?.message || "No fue posible generar el PDF del acta.");
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const found = getActa(actaId);
    setActa(found);

    if (!found) {
      setError("No se encontró el acta.");
      return;
    }

    generar(found);
  }, [actaId]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vista previa PDF</h1>
            <p className="mt-2 text-sm text-gray-500">
              Acta de entrega lista para revisar, descargar o imprimir.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/actas/${actaId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </a>

            <button
              type="button"
              onClick={() => acta && generar(acta)}
              disabled={!acta || loading}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                loading || !acta
                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                  : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              {loading ? "Generando..." : "Regenerar"}
            </button>

            <a
              href={pdfUrl || "#"}
              download={fileName}
              onClick={(e) => {
                if (!pdfUrl) e.preventDefault();
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                pdfUrl
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-blue-300 text-white"
              }`}
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </a>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        {pdfUrl ? (
          <iframe
            title="Vista previa PDF acta"
            src={pdfUrl}
            className="block h-[82vh] w-full rounded-xl border border-gray-200"
          />
        ) : (
          <div className="flex h-[82vh] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
            {loading ? "Generando PDF..." : "Aún no hay una vista previa disponible."}
          </div>
        )}
      </div>
    </div>
  );
}
