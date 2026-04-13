// src/components/cotizaciones/PDFPreview.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, ArrowLeft } from "lucide-react";
import { getCotizacion, type Cotizacion } from "../../lib/services/cotizacionLocalService";
import { generateCotizacionPdfBytes } from "../../lib/pdf/cotizacionPDF";

export default function PDFPreview({ cotizacionId }: { cotizacionId: string }) {
  const [cot, setCot] = useState<Cotizacion | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const filename = useMemo(() => {
    const base = cot?.numero ? `${cot.numero}` : `cotizacion-${cotizacionId}`;
    return `${base}.pdf`;
  }, [cot?.numero, cotizacionId]);

  const buildPdf = async (c: Cotizacion) => {
    setErr("");
    setLoading(true);
    try {
      const bytes = await generateCotizacionPdfBytes(c);
      const blob = new Blob([bytes], { type: "application/pdf" });

      // limpiar url previa
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (e: any) {
      setErr(e?.message ?? "No fue posible generar el PDF");
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const c = getCotizacion(cotizacionId);
    setCot(c);

    if (c) buildPdf(c);
    else setErr("No se encontró la cotización para generar el PDF.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotizacionId]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const onRegenerar = async () => {
    if (!cot) return;
    await buildPdf(cot);
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Vista previa PDF</h1>
          <p className="text-sm text-gray-500">
            Documento profesional listo para enviar/descargar.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`/cotizaciones/${cotizacionId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            onClick={onRegenerar}
            disabled={!cot || loading}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${
              loading || !cot
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-800"
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            {loading ? "Generando..." : "Regenerar"}
          </button>

          <a
            href={pdfUrl || "#"}
            download={filename}
            onClick={(e) => {
              if (!pdfUrl) e.preventDefault();
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${
              pdfUrl
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed"
            }`}
          >
            <Download className="h-4 w-4" />
            Descargar
          </a>
        </div>
      </header>

      {err ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      {pdfUrl ? (
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
          <iframe title="PDF" src={pdfUrl} className="w-full h-[78vh]" />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-sm text-gray-600">
          No hay PDF para mostrar.
        </div>
      )}
    </div>
  );
}
