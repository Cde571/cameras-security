import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$PrintLayout } from '../../../chunks/PrintLayout_CAqctmGb.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Download } from 'lucide-react';
import { g as getActa } from '../../../chunks/actaLocalService_BDWGoUzL.mjs';
import { g as getEmpresa } from '../../../chunks/configLocalService_DaV2BKqn.mjs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
export { renderers } from '../../../renderers.mjs';

function formatDateES(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(value));
  } catch {
    return value;
  }
}
function wrapText(text, maxChars) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}
async function buildActaPDF(payload, company = {}, _opts) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const width = page.getWidth();
  const height = page.getHeight();
  const margin = 40;
  const dark = rgb(0.12, 0.12, 0.16);
  const gray = rgb(0.42, 0.42, 0.48);
  const blue = rgb(0.12, 0.33, 0.75);
  const light = rgb(0.95, 0.97, 1);
  const border = rgb(0.85, 0.87, 0.9);
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: light
  });
  page.drawLine({
    start: { x: 0, y: height - 110 },
    end: { x: width, y: height - 110 },
    thickness: 1,
    color: border
  });
  page.drawText(company.nombre || "Technological Cameras", {
    x: margin,
    y: height - 48,
    size: 17,
    font: bold,
    color: dark
  });
  const companyLine1 = [
    company.nit ? `NIT: ${company.nit}` : "",
    company.telefono ? `Tel: ${company.telefono}` : ""
  ].filter(Boolean).join("  •  ");
  const companyLine2 = [
    company.email || "",
    company.direccion || "",
    company.ciudad || ""
  ].filter(Boolean).join("  •  ");
  if (companyLine1) {
    page.drawText(companyLine1, {
      x: margin,
      y: height - 66,
      size: 9,
      font,
      color: gray
    });
  }
  if (companyLine2) {
    page.drawText(companyLine2, {
      x: margin,
      y: height - 80,
      size: 9,
      font,
      color: gray
    });
  }
  const rightX = width - margin - 190;
  page.drawText("ACTA DE ENTREGA", {
    x: rightX,
    y: height - 50,
    size: 13,
    font: bold,
    color: blue
  });
  page.drawText(`No: ${payload.numero || "-"}`, {
    x: rightX,
    y: height - 68,
    size: 10,
    font: bold,
    color: dark
  });
  page.drawText(`Fecha: ${formatDateES(payload.fecha)}`, {
    x: rightX,
    y: height - 84,
    size: 9,
    font,
    color: gray
  });
  if (payload.ordenRef) {
    page.drawText(`Orden: ${payload.ordenRef}`, {
      x: rightX,
      y: height - 98,
      size: 9,
      font,
      color: gray
    });
  }
  let y = height - 145;
  page.drawText("Cliente", {
    x: margin,
    y,
    size: 11,
    font: bold,
    color: dark
  });
  y -= 16;
  page.drawText(payload.cliente?.nombre || "-", {
    x: margin,
    y,
    size: 10,
    font: bold,
    color: dark
  });
  y -= 14;
  const clienteLinea = [
    payload.cliente?.documento ? `Doc/NIT: ${payload.cliente.documento}` : "",
    payload.cliente?.telefono ? `Tel: ${payload.cliente.telefono}` : "",
    payload.cliente?.email ? `Email: ${payload.cliente.email}` : "",
    payload.cliente?.ciudad ? `Ciudad: ${payload.cliente.ciudad}` : ""
  ].filter(Boolean).join("  •  ");
  page.drawText(clienteLinea || "-", {
    x: margin,
    y,
    size: 9,
    font,
    color: gray
  });
  y -= 18;
  if (payload.proyecto) {
    page.drawText(`Proyecto: ${payload.proyecto}`, {
      x: margin,
      y,
      size: 9,
      font,
      color: gray
    });
    y -= 22;
  } else {
    y -= 8;
  }
  const tableX = margin;
  const tableW = width - margin * 2;
  const colDesc = tableX + 10;
  const colSerial = tableX + 225;
  const colUbic = tableX + 335;
  const colEstado = tableX + 485;
  page.drawRectangle({
    x: tableX,
    y,
    width: tableW,
    height: 22,
    color: light
  });
  page.drawText("Activo", {
    x: colDesc,
    y: y + 7,
    size: 9,
    font: bold,
    color: dark
  });
  page.drawText("Serial", {
    x: colSerial,
    y: y + 7,
    size: 9,
    font: bold,
    color: dark
  });
  page.drawText("Ubicación", {
    x: colUbic,
    y: y + 7,
    size: 9,
    font: bold,
    color: dark
  });
  page.drawText("Estado", {
    x: colEstado,
    y: y + 7,
    size: 9,
    font: bold,
    color: dark
  });
  let rowY = y - 16;
  for (const item of payload.activos || []) {
    const nombreLines = wrapText(item.nombre || "-", 28);
    const serialLines = wrapText(item.serial || "-", 12);
    const ubicLines = wrapText(item.ubicacion || "-", 18);
    const estadoLines = wrapText(item.estado || "OK", 10);
    const maxLines = Math.max(
      nombreLines.length,
      serialLines.length,
      ubicLines.length,
      estadoLines.length
    );
    const rowH = Math.max(18, maxLines * 11 + 4);
    page.drawLine({
      start: { x: tableX, y: rowY - 5 },
      end: { x: tableX + tableW, y: rowY - 5 },
      thickness: 0.6,
      color: border
    });
    nombreLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colDesc,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: dark
      });
    });
    serialLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colSerial,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: dark
      });
    });
    ubicLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colUbic,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: dark
      });
    });
    estadoLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colEstado,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: dark
      });
    });
    rowY -= rowH;
  }
  let textY = rowY - 16;
  if (payload.observaciones) {
    page.drawText("Observaciones", {
      x: margin,
      y: textY,
      size: 10,
      font: bold,
      color: dark
    });
    textY -= 14;
    for (const line of wrapText(payload.observaciones, 95)) {
      page.drawText(line, {
        x: margin,
        y: textY,
        size: 9,
        font,
        color: gray
      });
      textY -= 12;
    }
    textY -= 8;
  }
  if (payload.acuerdos) {
    page.drawText("Acuerdos", {
      x: margin,
      y: textY,
      size: 10,
      font: bold,
      color: dark
    });
    textY -= 14;
    for (const line of wrapText(payload.acuerdos, 95)) {
      page.drawText(line, {
        x: margin,
        y: textY,
        size: 9,
        font,
        color: gray
      });
      textY -= 12;
    }
  }
  const signY = 85;
  page.drawLine({
    start: { x: margin + 10, y: signY },
    end: { x: margin + 200, y: signY },
    thickness: 1,
    color: border
  });
  page.drawLine({
    start: { x: width - margin - 200, y: signY },
    end: { x: width - margin - 10, y: signY },
    thickness: 1,
    color: border
  });
  page.drawText("Entrega / Técnico", {
    x: margin + 55,
    y: signY - 16,
    size: 9,
    font,
    color: gray
  });
  page.drawText("Recibe / Cliente", {
    x: width - margin - 145,
    y: signY - 16,
    size: 9,
    font,
    color: gray
  });
  page.drawLine({
    start: { x: margin, y: 48 },
    end: { x: width - margin, y: 48 },
    thickness: 1,
    color: border
  });
  page.drawText("Documento generado automáticamente desde el módulo de actas.", {
    x: margin,
    y: 32,
    size: 8,
    font,
    color: gray
  });
  return await doc.save();
}

function safe(...values) {
  for (const value of values) {
    if (value !== void 0 && value !== null && value !== "") return value;
  }
  return void 0;
}
function mapActaToPayload(acta) {
  const cliente = acta?.cliente || {};
  const activosRaw = acta?.activos || acta?.items || acta?.equipos || acta?.productos || [];
  const activos = (Array.isArray(activosRaw) ? activosRaw : []).map((item) => ({
    id: item?.id,
    nombre: safe(item?.nombre, item?.descripcion, item?.productoNombre, "Activo"),
    serial: safe(item?.serial, item?.serie),
    ubicacion: safe(item?.ubicacion, item?.lugar),
    estado: safe(item?.estado, item?.condicion, "OK")
  }));
  return {
    numero: safe(acta?.numero, acta?.consecutivo, acta?.codigo, "ACTA-S/N"),
    fecha: safe(acta?.fecha, acta?.fechaEntrega, acta?.createdAt, (/* @__PURE__ */ new Date()).toISOString()),
    cliente: {
      nombre: safe(cliente?.nombre, acta?.clienteNombre),
      documento: safe(cliente?.documento, cliente?.nit, acta?.clienteDocumento),
      telefono: safe(cliente?.telefono, acta?.clienteTelefono),
      email: safe(cliente?.email, acta?.clienteEmail),
      direccion: safe(cliente?.direccion, acta?.clienteDireccion),
      ciudad: safe(cliente?.ciudad, acta?.clienteCiudad)
    },
    proyecto: safe(acta?.proyecto, acta?.asunto, acta?.titulo),
    ordenRef: safe(acta?.ordenRef, acta?.ordenId, acta?.ordenNumero),
    activos,
    observaciones: safe(acta?.observaciones, acta?.notas),
    acuerdos: safe(acta?.acuerdos, acta?.condiciones)
  };
}
function PDFPreview({ actaId }) {
  const [acta, setActa] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileName = useMemo(() => {
    const base = acta?.numero || `acta-${actaId}`;
    return `${base}.pdf`;
  }, [acta, actaId]);
  async function generar(data) {
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
    } catch (err) {
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
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-7xl space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Vista previa PDF" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Acta de entrega lista para revisar, descargar o imprimir." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/actas/${actaId}`,
            className: "inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
              "Volver"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => acta && generar(acta),
            disabled: !acta || loading,
            className: `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${loading || !acta ? "cursor-not-allowed bg-gray-200 text-gray-500" : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }),
              loading ? "Generando..." : "Regenerar"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: pdfUrl || "#",
            download: fileName,
            onClick: (e) => {
              if (!pdfUrl) e.preventDefault();
            },
            className: `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${pdfUrl ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-not-allowed bg-blue-300 text-white"}`,
            children: [
              /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
              "Descargar PDF"
            ]
          }
        )
      ] })
    ] }) }),
    error ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }) : null,
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-gray-200 bg-white p-3 shadow-sm", children: pdfUrl ? /* @__PURE__ */ jsx(
      "iframe",
      {
        title: "Vista previa PDF acta",
        src: pdfUrl,
        className: "block h-[82vh] w-full rounded-xl border border-gray-200"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "flex h-[82vh] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500", children: loading ? "Generando PDF..." : "Aún no hay una vista previa disponible." }) })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Pdf = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Pdf;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "PrintLayout", $$PrintLayout, { "title": `PDF Acta ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PDFPreview", PDFPreview, { "client:load": true, "actaId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/actas/PDFPreview", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/actas/[id]/pdf.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/actas/[id]/pdf.astro";
const $$url = "/actas/[id]/pdf";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pdf,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
