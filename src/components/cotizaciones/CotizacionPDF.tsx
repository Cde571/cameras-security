import React, { useEffect, useState } from "react";
import { getCotizacion, type Cotizacion } from "../../lib/services/cotizacionLocalService";
import PDFPreview from "./PDFPreview";

export default function CotizacionPDF({ cotizacionId }: { cotizacionId: string }) {
  const [c, setC] = useState<Cotizacion | null>(null);

  useEffect(() => {
    setC(getCotizacion(cotizacionId));
  }, [cotizacionId]);

  if (!c) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">Cotización no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="print:p-0">
      <PDFPreview cotizacion={c} />
    </div>
  );
}
