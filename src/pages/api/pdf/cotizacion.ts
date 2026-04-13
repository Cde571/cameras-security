import type { APIRoute } from "astro";
import { buildCotizacionPDF, type CotizacionPDFInput } from "../../../lib/pdf/cotizacionPDF";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);

  const cot = body?.cotizacion as CotizacionPDFInput | undefined;
  const empresa = body?.empresa as any;

  if (!cot?.numero || !cot?.fechaISO || !cot?.cliente?.nombre || !Array.isArray(cot?.items)) {
    return new Response(JSON.stringify({ ok: false, message: "Payload inválido para PDF" }), { status: 400 });
  }

  const bytes = await buildCotizacionPDF(cot, empresa);
  const filename = `COT-${cot.numero}.pdf`.replace(/[^\w\-\.]/g, "_");

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
};
