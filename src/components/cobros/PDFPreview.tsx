import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { getCobro, type CuentaCobro } from "../../lib/services/cobroPagoLocalService";
import { getEmpresa, listPlantillas } from "../../lib/services/configLocalService";
import { generateCuentaCobroPdfBytes } from "../../lib/pdf/cuentaCobroPDF";

export default function PDFPreview({ cobroId }: { cobroId: string }) {
  const [cobro, setCobro] = useState<CuentaCobro | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileName = useMemo(() => {
    const base = cobro?.numero || `cuenta-cobro-${cobroId}`;
    return `${base}.pdf`;
  }, [cobro?.numero, cobroId]);

  async function generarPdf(data: CuentaCobro) {
    setLoading(true);
    setError("");

    try {
      const empresa = getEmpresa();
      const plantillaCobro = listPlantillas().find((p) => p.tipo === "cobro" && p.nombre)?.contenido || "";

      const bytes = await generateCuentaCobroPdfBytes(data, {
        empresa,
        plantillaTexto: plantillaCobro,
        firmaEmisor: empresa.nombre || "Emisor",
        firmaCliente: data.cliente?.nombre || "Cliente",
      });

      const blob = new Blob([bytes], { type: "application/pdf" });
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err: any) {
      setError(err?.message || "No fue posible generar el PDF.");
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const found = getCobro(cobroId);
    setCobro(found);

    if (!found) {
      setError("No se encontró la cuenta de cobro.");
      return;
    }

    generarPdf(found);
  }, [cobroId]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Vista previa PDF
          </h1>
          <p className="text-sm text-gray-500">
            Cuenta de cobro lista para revisar, descargar o imprimir.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`/cobros/${cobroId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </a>

          <button
            type="button"
            onClick={() => cobro && generarPdf(cobro)}
            disabled={!cobro || loading}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${
              loading || !cobro
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
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${
              pdfUrl
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-blue-300 text-white"
            }`}
          >
            <Download className="h-4 w-4" />
            Descargar PDF
          </a>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {pdfUrl ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <iframe
            title="Vista previa PDF cuenta de cobro"
            src={pdfUrl}
            className="h-[78vh] w-full"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          {loading ? "Generando PDF..." : "Aún no hay una vista previa disponible."}
        </div>
      )}
    </div>
  );
}
