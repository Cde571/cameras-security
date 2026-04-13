import React, { useEffect, useMemo, useState } from "react";
import { Download, RefreshCcw } from "lucide-react";
import * as cotSvc from "../../lib/services/cotizacionLocalService";

type Props = { cotizacionId: string };

function toISODate(v: any) {
  if (!v) return new Date().toISOString().slice(0, 10);
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const d = new Date(v);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function normalizeCotizacion(raw: any, id: string) {
  const items = (raw?.items ?? raw?.detalle ?? raw?.productos ?? []).map((it: any) => ({
    codigo: it.codigo ?? it.sku ?? it.ref ?? "",
    descripcion: it.descripcion ?? it.nombre ?? "Ítem",
    cantidad: Number(it.cantidad ?? it.qty ?? 1),
    unidad: it.unidad ?? "",
    precioUnitario: Number(it.precioUnitario ?? it.unitPrice ?? it.precio ?? 0),
    ivaPct: Number(it.ivaPct ?? it.iva ?? 19),
    descuentoPct: Number(it.descuentoPct ?? it.descuento ?? 0),
  }));

  return {
    numero: raw?.numero ?? raw?.number ?? `COT-${id}`,
    fechaISO: toISODate(raw?.fecha ?? raw?.date),
    validezDias: Number(raw?.validezDias ?? 15),
    vendedor: raw?.vendedor ?? raw?.asesor ?? "—",
    cliente: {
      nombre: raw?.cliente?.nombre ?? raw?.client?.nombre ?? raw?.clienteNombre ?? "Cliente",
      documento: raw?.cliente?.documento ?? raw?.clienteDocumento ?? "",
      telefono: raw?.cliente?.telefono ?? raw?.clienteTelefono ?? "",
      email: raw?.cliente?.email ?? raw?.clienteEmail ?? "",
      direccion: raw?.cliente?.direccion ?? raw?.clienteDireccion ?? "",
      ciudad: raw?.cliente?.ciudad ?? raw?.clienteCiudad ?? "",
    },
    items,
    condiciones: raw?.condiciones ?? undefined,
    notas: raw?.notas ?? "",
    moneda: "COP",
  };
}

export default function PDFPreview({ cotizacionId }: Props) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const getCotizacion =
    (cotSvc as any).getCotizacion ??
    (cotSvc as any).getCotizacionById ??
    (cotSvc as any).getCotizacionLocal;

  const empresa = useMemo(
    () => ({
      nombre: "Tecnological Cameras",
      nit: "NIT: 000.000.000-0",
      telefono: "Tel: +57 300 000 0000",
      email: "ventas@empresa.com",
      direccion: "Medellín, Colombia",
      logoPath: "public/brand/logo.png",
    }),
    []
  );

  const generate = async () => {
    setLoading(true);
    setErr("");

    try {
      const raw = getCotizacion ? getCotizacion(cotizacionId) : null;
      if (!raw) throw new Error("No se encontró la cotización para generar el PDF.");

      const payload = { empresa, cotizacion: normalizeCotizacion(raw, cotizacionId) };

      const res = await fetch("/api/pdf/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? "No fue posible generar el PDF.");
      }

      const blob = await res.blob();
      const nextUrl = URL.createObjectURL(blob);

      setUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return nextUrl;
      });
    } catch (e: any) {
      setErr(e?.message ?? "Error generando PDF");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generate();
    return () => {
      setUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotizacionId]);

  const download = async () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `cotizacion-${cotizacionId}.pdf`;
    a.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Vista previa PDF</h2>
          <p className="text-sm text-gray-500">Documento profesional listo para enviar/descargar.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4" />
            Regenerar
          </button>

          <button
            onClick={download}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-blue-300"
            disabled={!url || loading}
          >
            <Download className="h-4 w-4" />
            Descargar
          </button>
        </div>
      </div>

      {err ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Generando PDF...</div>
        ) : url ? (
          <iframe title="pdf" src={url} className="w-full" style={{ height: "75vh" }} />
        ) : (
          <div className="p-6 text-sm text-gray-600">No hay PDF para mostrar.</div>
        )}
      </div>
    </div>
  );
}
