import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_BUC8yk9S.mjs';
import 'piccolore';
import { $ as $$PrintLayout } from '../../../chunks/PrintLayout_CAqctmGb.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Download } from 'lucide-react';
import { g as getCobro } from '../../../chunks/cobroPagoLocalService_BSn6kzk1.mjs';
import { g as getEmpresa, l as listPlantillas } from '../../../chunks/configLocalService_C83i_HSE.mjs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
export { renderers } from '../../../renderers.mjs';

function moneyCOP(n) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(n || 0);
}
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
    if (next.length <= maxChars) current = next;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}
async function generateCuentaCobroPdfBytes(cobro, options = {}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();
  const margin = 40;
  const colors = {
    dark: rgb(0.12, 0.12, 0.16),
    gray: rgb(0.42, 0.42, 0.48),
    light: rgb(0.92, 0.94, 0.97),
    blue: rgb(0.12, 0.33, 0.75),
    softBlue: rgb(0.97, 0.98, 1),
    border: rgb(0.85, 0.87, 0.9)
  };
  const empresa = {
    nombre: options.empresa?.nombre || "Technological Cameras",
    nit: options.empresa?.nit || "",
    telefono: options.empresa?.telefono || "",
    email: options.empresa?.email || "",
    direccion: options.empresa?.direccion || "",
    ciudad: options.empresa?.ciudad || "",
    website: options.empresa?.website || ""
  };
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: colors.softBlue
  });
  page.drawLine({
    start: { x: 0, y: height - 110 },
    end: { x: width, y: height - 110 },
    thickness: 1,
    color: colors.border
  });
  page.drawText(empresa.nombre, {
    x: margin,
    y: height - 50,
    size: 17,
    font: fontBold,
    color: colors.dark
  });
  const empresaLine1 = [empresa.nit ? `NIT: ${empresa.nit}` : "", empresa.telefono ? `Tel: ${empresa.telefono}` : ""].filter(Boolean).join("  •  ");
  const empresaLine2 = [empresa.email, empresa.direccion, empresa.ciudad, empresa.website].filter(Boolean).join("  •  ");
  if (empresaLine1) {
    page.drawText(empresaLine1, {
      x: margin,
      y: height - 67,
      size: 9,
      font,
      color: colors.gray
    });
  }
  if (empresaLine2) {
    page.drawText(empresaLine2, {
      x: margin,
      y: height - 81,
      size: 9,
      font,
      color: colors.gray
    });
  }
  const rightX = width - margin - 190;
  page.drawText("CUENTA DE COBRO", {
    x: rightX,
    y: height - 50,
    size: 13,
    font: fontBold,
    color: colors.blue
  });
  page.drawText(`No: ${cobro.numero}`, {
    x: rightX,
    y: height - 68,
    size: 10,
    font: fontBold,
    color: colors.dark
  });
  page.drawText(`Emisión: ${formatDateES(cobro.fechaEmision)}`, {
    x: rightX,
    y: height - 84,
    size: 9,
    font,
    color: colors.gray
  });
  page.drawText(`Vencimiento: ${formatDateES(cobro.fechaVencimiento)}`, {
    x: rightX,
    y: height - 98,
    size: 9,
    font,
    color: colors.gray
  });
  let y = height - 145;
  page.drawText("Cliente", {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: colors.dark
  });
  y -= 16;
  page.drawText(cobro.cliente?.nombre || "-", {
    x: margin,
    y,
    size: 10,
    font: fontBold,
    color: colors.dark
  });
  y -= 14;
  const clienteLine = [
    cobro.cliente?.documento ? `Doc/NIT: ${cobro.cliente.documento}` : "",
    cobro.cliente?.telefono ? `Tel: ${cobro.cliente.telefono}` : "",
    cobro.cliente?.email ? `Email: ${cobro.cliente.email}` : "",
    cobro.cliente?.ciudad ? `Ciudad: ${cobro.cliente.ciudad}` : ""
  ].filter(Boolean).join("  •  ");
  page.drawText(clienteLine || "-", {
    x: margin,
    y,
    size: 9,
    font,
    color: colors.gray
  });
  y -= 28;
  const tableX = margin;
  const tableW = width - margin * 2;
  const colDesc = tableX + 10;
  const colCant = tableX + tableW - 210;
  const colUnit = tableX + tableW - 150;
  const colIva = tableX + tableW - 90;
  const colTotal = tableX + tableW - 15;
  page.drawRectangle({
    x: tableX,
    y,
    width: tableW,
    height: 22,
    color: colors.light
  });
  page.drawText("Descripción", { x: colDesc, y: y + 7, size: 9, font: fontBold, color: colors.dark });
  page.drawText("Cant", { x: colCant, y: y + 7, size: 9, font: fontBold, color: colors.dark });
  page.drawText("Unit", { x: colUnit, y: y + 7, size: 9, font: fontBold, color: colors.dark });
  page.drawText("IVA", { x: colIva, y: y + 7, size: 9, font: fontBold, color: colors.dark });
  page.drawText("Total", { x: colTotal - 34, y: y + 7, size: 9, font: fontBold, color: colors.dark });
  let rowY = y - 16;
  for (const item of cobro.servicios || []) {
    const base = (item.cantidad || 0) * (item.unitario || 0);
    const iva = base * ((item.ivaPct || 0) / 100);
    const total = base + iva;
    const descLines = wrapText(item.descripcion || "", 48);
    const rowH = Math.max(18, descLines.length * 11 + 4);
    page.drawLine({
      start: { x: tableX, y: rowY - 5 },
      end: { x: tableX + tableW, y: rowY - 5 },
      thickness: 0.6,
      color: colors.border
    });
    descLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colDesc,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: colors.dark
      });
    });
    page.drawText(String(item.cantidad || 0), {
      x: colCant + 6,
      y: rowY,
      size: 9,
      font,
      color: colors.dark
    });
    page.drawText(moneyCOP(item.unitario || 0), {
      x: colUnit - 8,
      y: rowY,
      size: 9,
      font,
      color: colors.dark
    });
    page.drawText(`${item.ivaPct || 0}%`, {
      x: colIva + 6,
      y: rowY,
      size: 9,
      font,
      color: colors.dark
    });
    page.drawText(moneyCOP(total), {
      x: colTotal - 96,
      y: rowY,
      size: 9,
      font: fontBold,
      color: colors.dark
    });
    rowY -= rowH;
  }
  const totalsBoxW = 220;
  const totalsBoxH = 72;
  const totalsBoxX = width - margin - totalsBoxW;
  const totalsBoxY = Math.max(120, rowY - 12);
  page.drawRectangle({
    x: totalsBoxX,
    y: totalsBoxY,
    width: totalsBoxW,
    height: totalsBoxH,
    color: rgb(0.99, 0.99, 1),
    borderColor: colors.border,
    borderWidth: 1
  });
  page.drawText("Subtotal", {
    x: totalsBoxX + 12,
    y: totalsBoxY + 49,
    size: 9,
    font,
    color: colors.dark
  });
  page.drawText(moneyCOP(cobro.subtotal || 0), {
    x: totalsBoxX + 110,
    y: totalsBoxY + 49,
    size: 9,
    font: fontBold,
    color: colors.dark
  });
  page.drawText("IVA", {
    x: totalsBoxX + 12,
    y: totalsBoxY + 32,
    size: 9,
    font,
    color: colors.dark
  });
  page.drawText(moneyCOP(cobro.iva || 0), {
    x: totalsBoxX + 110,
    y: totalsBoxY + 32,
    size: 9,
    font: fontBold,
    color: colors.dark
  });
  page.drawLine({
    start: { x: totalsBoxX + 12, y: totalsBoxY + 23 },
    end: { x: totalsBoxX + totalsBoxW - 12, y: totalsBoxY + 23 },
    thickness: 0.8,
    color: colors.border
  });
  page.drawText("TOTAL", {
    x: totalsBoxX + 12,
    y: totalsBoxY + 8,
    size: 10,
    font: fontBold,
    color: colors.blue
  });
  page.drawText(moneyCOP(cobro.total || 0), {
    x: totalsBoxX + 110,
    y: totalsBoxY + 8,
    size: 10,
    font: fontBold,
    color: colors.blue
  });
  let textY = totalsBoxY - 24;
  if (cobro.observaciones) {
    page.drawText("Observaciones", {
      x: margin,
      y: textY,
      size: 10,
      font: fontBold,
      color: colors.dark
    });
    textY -= 14;
    for (const line of wrapText(cobro.observaciones, 95)) {
      page.drawText(line, {
        x: margin,
        y: textY,
        size: 9,
        font,
        color: colors.gray
      });
      textY -= 12;
    }
    textY -= 8;
  }
  if (options.plantillaTexto) {
    page.drawText("Condiciones / Forma de pago", {
      x: margin,
      y: textY,
      size: 10,
      font: fontBold,
      color: colors.dark
    });
    textY -= 14;
    for (const line of wrapText(options.plantillaTexto, 95)) {
      page.drawText(line, {
        x: margin,
        y: textY,
        size: 9,
        font,
        color: colors.gray
      });
      textY -= 12;
    }
  }
  const signY = 85;
  page.drawLine({
    start: { x: margin + 10, y: signY },
    end: { x: margin + 200, y: signY },
    thickness: 1,
    color: colors.border
  });
  page.drawLine({
    start: { x: width - margin - 200, y: signY },
    end: { x: width - margin - 10, y: signY },
    thickness: 1,
    color: colors.border
  });
  page.drawText(options.firmaEmisor || empresa.nombre, {
    x: margin + 20,
    y: signY - 16,
    size: 9,
    font,
    color: colors.gray
  });
  page.drawText(options.firmaCliente || cobro.cliente?.nombre || "Cliente", {
    x: width - margin - 155,
    y: signY - 16,
    size: 9,
    font,
    color: colors.gray
  });
  page.drawLine({
    start: { x: margin, y: 48 },
    end: { x: width - margin, y: 48 },
    thickness: 1,
    color: colors.border
  });
  page.drawText("Documento generado automáticamente desde el módulo de cuentas de cobro.", {
    x: margin,
    y: 32,
    size: 8,
    font,
    color: colors.gray
  });
  return await pdfDoc.save();
}

function PDFPreview({ cobroId }) {
  const [cobro, setCobro] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileName = useMemo(() => {
    const base = cobro?.numero || `cuenta-cobro-${cobroId}`;
    return `${base}.pdf`;
  }, [cobro?.numero, cobroId]);
  async function generarPdf(data) {
    setLoading(true);
    setError("");
    try {
      const empresa = getEmpresa();
      const plantillaCobro = listPlantillas().find((p) => p.tipo === "cobro" && p.nombre)?.contenido || "";
      const bytes = await generateCuentaCobroPdfBytes(data, {
        empresa,
        plantillaTexto: plantillaCobro,
        firmaEmisor: empresa.nombre || "Emisor",
        firmaCliente: data.cliente?.nombre || "Cliente"
      });
      const blob = new Blob([bytes], { type: "application/pdf" });
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Vista previa PDF" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Cuenta de cobro lista para revisar, descargar o imprimir." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/cobros/${cobroId}`,
            className: "inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50",
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
            onClick: () => cobro && generarPdf(cobro),
            disabled: !cobro || loading,
            className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 ${loading || !cobro ? "cursor-not-allowed bg-gray-200 text-gray-500" : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"}`,
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
            className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 ${pdfUrl ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-not-allowed bg-blue-300 text-white"}`,
            children: [
              /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
              "Descargar PDF"
            ]
          }
        )
      ] })
    ] }),
    error ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: error }) : null,
    pdfUrl ? /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm", children: /* @__PURE__ */ jsx(
      "iframe",
      {
        title: "Vista previa PDF cuenta de cobro",
        src: pdfUrl,
        className: "h-[78vh] w-full"
      }
    ) }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500", children: loading ? "Generando PDF..." : "Aún no hay una vista previa disponible." })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Pdf = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Pdf;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "PrintLayout", $$PrintLayout, { "title": `PDF Cobro ${id}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PDFPreview", PDFPreview, { "client:load": true, "cobroId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/caco2/Documents/Projects/technological-cameras/src/components/cobros/PDFPreview", "client:component-export": "default" })} ` })}`;
}, "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cobros/[id]/pdf.astro", void 0);

const $$file = "C:/Users/caco2/Documents/Projects/technological-cameras/src/pages/cobros/[id]/pdf.astro";
const $$url = "/cobros/[id]/pdf";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pdf,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
