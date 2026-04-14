import { rgb, PDFDocument, StandardFonts } from 'pdf-lib';
export { renderers } from '../../../renderers.mjs';

const A4 = { w: 595.28, h: 841.89 };
const COLORS = {
  primary: rgb(0.2, 0.5, 0.9),
  // Azul brillante
  primaryLight: rgb(0.85, 0.93, 0.98),
  // Azul muy claro
  accent: rgb(1, 0.75, 0),
  // Naranja/dorado
  success: rgb(0.2, 0.7, 0.3),
  // Verde
  dark: rgb(0.1, 0.1, 0.15),
  gray: rgb(0.4, 0.4, 0.45),
  lightGray: rgb(0.85, 0.86, 0.88),
  veryLightGray: rgb(0.95, 0.96, 0.97),
  tableBorder: rgb(0.7, 0.7, 0.75),
  tableHeader: rgb(0.85, 0.93, 0.98),
  white: rgb(1, 1, 1)
};
function formatMoneyCOP(n) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(n || 0);
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
function calcTotales(items) {
  const subtotal = items.reduce((acc, it) => acc + (it.precio || 0) * (it.qty || 0), 0);
  const iva = items.reduce((acc, it) => {
    const base = (it.precio || 0) * (it.qty || 0);
    return acc + base * ((it.ivaPct || 0) / 100);
  }, 0);
  const total = subtotal + iva;
  return { subtotal, iva, total };
}
const BENEFICIOS_DEFAULT = [
  {
    icono: "[CAM]",
    titulo: "Vigilancia con Máxima Claridad",
    descripcion: "Imágenes de alta resolución para identificar todo detalle con precisión."
  },
  {
    icono: "[BAT]",
    titulo: "Protección ante Cortes de Luz",
    descripcion: "Sistema UPS que mantiene todo funcionando incluso sin electricidad."
  },
  {
    icono: "[OK]",
    titulo: "Instalación de Larga Duración",
    descripcion: "Materiales de calidad resistentes a la humedad y condiciones extremas."
  },
  {
    icono: "[>>]",
    titulo: "Transmisión Rápida y Fluida",
    descripcion: "Red Gigabit para ver videos en vivo sin interrupciones ni demoras."
  }
];
function drawTitle(page, y, text, fontBold) {
  page.drawRectangle({
    x: 40,
    y: y - 18,
    width: A4.w - 80,
    height: 20,
    color: COLORS.lightGray
  });
  page.drawText(text, {
    x: 45,
    y: y - 14,
    size: 11,
    font: fontBold,
    color: COLORS.dark
  });
}
function drawContactCards(page, y, font, fontBold, empresa, cliente) {
  const cardWidth = (A4.w - 100) / 2;
  const cardHeight = 110;
  const leftX = 40;
  const rightX = 40 + cardWidth + 20;
  page.drawRectangle({
    x: leftX,
    y: y - cardHeight,
    width: cardWidth,
    height: cardHeight,
    borderColor: COLORS.tableBorder,
    borderWidth: 1
  });
  page.drawRectangle({
    x: leftX,
    y: y - 22,
    width: cardWidth,
    height: 22,
    color: COLORS.tableHeader
  });
  page.drawText("Datos Prestador", {
    x: leftX + 8,
    y: y - 16,
    size: 9,
    font: fontBold,
    color: COLORS.dark
  });
  let textY = y - 38;
  const prestadorData = [
    ["Nombre:", empresa.nombre || ""],
    ["NIT/Cédula:", empresa.nit || ""],
    ["Dirección:", empresa.direccion || ""],
    ["Celular:", empresa.telefono || ""],
    ["Correo:", empresa.email || ""]
  ];
  prestadorData.forEach(([label, value]) => {
    page.drawText(label, {
      x: leftX + 8,
      y: textY,
      size: 8,
      font: fontBold,
      color: COLORS.gray
    });
    page.drawText(value, {
      x: leftX + 65,
      y: textY,
      size: 8,
      font,
      color: COLORS.dark
    });
    textY -= 14;
  });
  page.drawRectangle({
    x: rightX,
    y: y - cardHeight,
    width: cardWidth,
    height: cardHeight,
    borderColor: COLORS.tableBorder,
    borderWidth: 1
  });
  page.drawRectangle({
    x: rightX,
    y: y - 22,
    width: cardWidth,
    height: 22,
    color: COLORS.tableHeader
  });
  page.drawText("Datos Cliente", {
    x: rightX + 8,
    y: y - 16,
    size: 9,
    font: fontBold,
    color: COLORS.dark
  });
  textY = y - 38;
  const clienteData = [
    ["Nombre:", cliente.nombre || ""],
    ["NIT/Cédula:", cliente.documento || ""],
    ["Dirección:", cliente.direccion || ""],
    ["Celular:", cliente.telefono || ""],
    ["Correo:", cliente.email || ""]
  ];
  clienteData.forEach(([label, value]) => {
    page.drawText(label, {
      x: rightX + 8,
      y: textY,
      size: 8,
      font: fontBold,
      color: COLORS.gray
    });
    const displayValue = value.length > 30 ? value.substring(0, 27) + "..." : value;
    page.drawText(displayValue, {
      x: rightX + 65,
      y: textY,
      size: 8,
      font,
      color: COLORS.dark
    });
    textY -= 14;
  });
  return y - cardHeight - 15;
}
function drawItemsTable(page, y, font, fontBold, items) {
  const margin = 40;
  const tableWidth = A4.w - margin * 2;
  const headerHeight = 20;
  page.drawRectangle({
    x: margin,
    y: y - headerHeight,
    width: tableWidth,
    height: headerHeight,
    color: COLORS.tableHeader,
    borderColor: COLORS.tableBorder,
    borderWidth: 1
  });
  page.drawText("Cantidad", {
    x: margin + 8,
    y: y - 14,
    size: 9,
    font: fontBold,
    color: COLORS.dark
  });
  page.drawText("Ítem", {
    x: margin + 70,
    y: y - 14,
    size: 9,
    font: fontBold,
    color: COLORS.dark
  });
  let rowY = y - headerHeight;
  items.forEach((item) => {
    const descText = `${item.nombre}${item.kind ? ` - ${item.kind}` : ""}`;
    const lines = wrapText(descText, 70);
    const rowHeight = Math.max(22, lines.length * 11 + 8);
    page.drawRectangle({
      x: margin,
      y: rowY - rowHeight,
      width: tableWidth,
      height: rowHeight,
      borderColor: COLORS.tableBorder,
      borderWidth: 0.5
    });
    page.drawText(String(item.qty), {
      x: margin + 20,
      y: rowY - 14,
      size: 9,
      font,
      color: COLORS.dark
    });
    lines.forEach((line, i) => {
      page.drawText(line, {
        x: margin + 70,
        y: rowY - 14 - i * 11,
        size: 8,
        font,
        color: COLORS.dark
      });
    });
    rowY -= rowHeight;
  });
  return rowY - 10;
}
function drawTotal(page, y, font, fontBold, total) {
  const boxWidth = 200;
  const boxHeight = 35;
  const boxX = A4.w - 40 - boxWidth;
  page.drawRectangle({
    x: boxX,
    y: y - boxHeight,
    width: boxWidth,
    height: boxHeight,
    color: COLORS.accent,
    borderColor: COLORS.dark,
    borderWidth: 2
  });
  page.drawText("$ TOTAL", {
    x: boxX + 15,
    y: y - 22,
    size: 14,
    font: fontBold,
    color: COLORS.dark
  });
  page.drawText(formatMoneyCOP(total), {
    x: boxX + 95,
    y: y - 22,
    size: 14,
    font: fontBold,
    color: COLORS.dark
  });
  return y - boxHeight - 15;
}
function drawBeneficios(page, y, font, fontBold, beneficios) {
  const margin = 40;
  const boxWidth = A4.w - margin * 2;
  let currentY = y;
  beneficios.forEach((beneficio, index) => {
    const boxHeight = 48;
    page.drawRectangle({
      x: margin,
      y: currentY - boxHeight,
      width: boxWidth,
      height: boxHeight,
      borderColor: COLORS.tableBorder,
      borderWidth: 1
    });
    const iconSize = 28;
    const iconX = margin + 10;
    const iconY = currentY - 30;
    page.drawRectangle({
      x: iconX,
      y: iconY,
      width: iconSize,
      height: iconSize,
      color: COLORS.primaryLight,
      borderColor: COLORS.primary,
      borderWidth: 1.5
    });
    if (beneficio.icono) {
      page.drawText(beneficio.icono, {
        x: iconX + 4,
        y: iconY + 8,
        size: 9,
        font: fontBold,
        color: COLORS.primary
      });
    }
    page.drawText(beneficio.titulo, {
      x: margin + 50,
      y: currentY - 18,
      size: 10,
      font: fontBold,
      color: COLORS.dark
    });
    const descLines = wrapText(beneficio.descripcion, 75);
    descLines.forEach((line, i) => {
      page.drawText(line, {
        x: margin + 50,
        y: currentY - 32 - i * 10,
        size: 8,
        font,
        color: COLORS.gray
      });
    });
    currentY -= boxHeight + 5;
  });
  return currentY - 10;
}
function drawCondiciones(page, y, font, fontBold, condiciones) {
  const margin = 40;
  const tableWidth = A4.w - margin * 2;
  const colWidth = tableWidth / 2;
  const headerHeight = 20;
  page.drawRectangle({
    x: margin,
    y: y - headerHeight,
    width: colWidth,
    height: headerHeight,
    color: COLORS.tableHeader,
    borderColor: COLORS.tableBorder,
    borderWidth: 1
  });
  page.drawText("Formas de Pago", {
    x: margin + colWidth / 2 - 40,
    y: y - 14,
    size: 9,
    font: fontBold,
    color: COLORS.dark
  });
  page.drawRectangle({
    x: margin + colWidth,
    y: y - headerHeight,
    width: colWidth,
    height: headerHeight,
    color: COLORS.tableHeader,
    borderColor: COLORS.tableBorder,
    borderWidth: 1
  });
  page.drawText("Elemento de Garantía", {
    x: margin + colWidth + colWidth / 2 - 50,
    y: y - 14,
    size: 9,
    font: fontBold,
    color: COLORS.dark
  });
  let rowY = y - headerHeight - 15;
  const pagoOpciones = [
    "[ ] Efectivo",
    "[ ] Transferencia",
    "[ ] Cheque",
    "[ ] Otro"
  ];
  pagoOpciones.forEach((opcion) => {
    page.drawText(opcion, {
      x: margin + 15,
      y: rowY,
      size: 8,
      font,
      color: COLORS.dark
    });
    rowY -= 14;
  });
  rowY = y - headerHeight - 15;
  page.drawText("[OK] Mano de obra", {
    x: margin + colWidth + 15,
    y: rowY,
    size: 8,
    font,
    color: COLORS.dark
  });
  page.drawText("1 año", {
    x: margin + colWidth + 140,
    y: rowY,
    size: 8,
    font: fontBold,
    color: COLORS.dark
  });
  rowY -= 14;
  page.drawText("[>>] Equipos suministrados", {
    x: margin + colWidth + 15,
    y: rowY,
    size: 8,
    font,
    color: COLORS.dark
  });
  page.drawText("1 año", {
    x: margin + colWidth + 140,
    y: rowY,
    size: 8,
    font: fontBold,
    color: COLORS.dark
  });
  rowY -= 25;
  const detailHeaderY = rowY;
  const condHeaders = [
    { text: "Condición", x: margin + 8 },
    { text: "Detalle", x: margin + tableWidth / 4 + 8 },
    { text: "Condición", x: margin + tableWidth / 2 + 8 },
    { text: "Detalle", x: margin + 3 * tableWidth / 4 + 8 }
  ];
  page.drawRectangle({
    x: margin,
    y: detailHeaderY - 18,
    width: tableWidth,
    height: 18,
    color: COLORS.tableHeader,
    borderColor: COLORS.tableBorder,
    borderWidth: 1
  });
  condHeaders.forEach((header, i) => {
    page.drawText(header.text, {
      x: header.x,
      y: detailHeaderY - 13,
      size: 8,
      font: fontBold,
      color: COLORS.dark
    });
  });
  let condY = detailHeaderY - 18 - 14;
  const rowsData = [
    [
      "Validez",
      `${condiciones?.validezDias || 15} días calendario`,
      "Entrega",
      condiciones?.tiempoEntrega || "1 a 3 días hábiles"
    ],
    [
      "Mano de Obra",
      condiciones?.formaPago || "Con cuenta de cobro",
      "Materiales",
      condiciones?.materiales || "Incluyen IVA del 19%"
    ],
    [
      "Adicionales",
      condiciones?.adicionales || "Se notificará y cobrará adicional",
      "",
      ""
    ]
  ];
  rowsData.forEach((row) => {
    page.drawRectangle({
      x: margin,
      y: condY - 12,
      width: tableWidth,
      height: 20,
      borderColor: COLORS.tableBorder,
      borderWidth: 0.5
    });
    page.drawText(row[0], {
      x: margin + 8,
      y: condY,
      size: 7,
      font: fontBold,
      color: COLORS.dark
    });
    const detail1Lines = wrapText(row[1], 20);
    detail1Lines.forEach((line, i) => {
      page.drawText(line, {
        x: margin + tableWidth / 4 + 8,
        y: condY - i * 9,
        size: 7,
        font,
        color: COLORS.gray
      });
    });
    if (row[2]) {
      page.drawText(row[2], {
        x: margin + tableWidth / 2 + 8,
        y: condY,
        size: 7,
        font: fontBold,
        color: COLORS.dark
      });
    }
    if (row[3]) {
      const detail2Lines = wrapText(row[3], 20);
      detail2Lines.forEach((line, i) => {
        page.drawText(line, {
          x: margin + 3 * tableWidth / 4 + 8,
          y: condY - i * 9,
          size: 7,
          font,
          color: COLORS.gray
        });
      });
    }
    condY -= 20;
  });
  return condY - 10;
}
function drawFirmas(page, y, font, fontBold) {
  const margin = 40;
  const boxWidth = (A4.w - margin * 2 - 20) / 2;
  const boxHeight = 50;
  page.drawRectangle({
    x: margin,
    y: y - boxHeight,
    width: boxWidth,
    height: boxHeight,
    borderColor: COLORS.tableBorder,
    borderWidth: 1
  });
  page.drawText("Firma del Prestador del Servicio", {
    x: margin + boxWidth / 2 - 70,
    y: y - 15,
    size: 8,
    font: fontBold,
    color: COLORS.dark
  });
  page.drawRectangle({
    x: margin + boxWidth + 20,
    y: y - boxHeight,
    width: boxWidth,
    height: boxHeight,
    borderColor: COLORS.tableBorder,
    borderWidth: 1
  });
  page.drawText("Firma del Cliente", {
    x: margin + boxWidth + 20 + boxWidth / 2 - 40,
    y: y - 15,
    size: 8,
    font: fontBold,
    color: COLORS.dark
  });
  return y - boxHeight;
}
async function buildCotizacionPDF(cotizacion, empresa) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4.w, A4.h]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const empresaData = empresa || {
    nombre: "TECHNOLOGICAL CAMERAS",
    nit: "900.123.456-7",
    direccion: "Carrera 26M # 72D-27",
    telefono: "3146617754",
    email: "info@techcameras.com"
  };
  let currentY = A4.h - 30;
  page.drawText("COTIZACIÓN / CUENTA DE COBRO", {
    x: A4.w / 2 - 90,
    y: currentY,
    size: 14,
    font: fontBold,
    color: COLORS.primary
  });
  currentY -= 25;
  drawTitle(page, currentY, "1. Datos de Contacto y Partes", fontBold);
  currentY -= 25;
  currentY = drawContactCards(page, currentY, font, fontBold, empresaData, cotizacion.cliente);
  drawTitle(page, currentY, `2. ${cotizacion.asunto || "Descripción del Proyecto"}`, fontBold);
  currentY -= 25;
  currentY = drawItemsTable(page, currentY, font, fontBold, cotizacion.items);
  drawTitle(page, currentY, "3. Valor Total", fontBold);
  currentY -= 25;
  const totals = calcTotales(cotizacion.items);
  currentY = drawTotal(page, currentY, font, fontBold, totals.total);
  drawTitle(page, currentY, "4. Observaciones y Beneficios del Proyecto", fontBold);
  currentY -= 25;
  const beneficios = cotizacion.beneficios || BENEFICIOS_DEFAULT.slice(0, 4);
  currentY = drawBeneficios(page, currentY, font, fontBold, beneficios);
  const page2 = pdfDoc.addPage([A4.w, A4.h]);
  currentY = A4.h - 40;
  drawTitle(page2, currentY, "5. Condiciones Comerciales", fontBold);
  currentY -= 25;
  currentY = drawCondiciones(
    page2,
    currentY,
    font,
    fontBold,
    cotizacion.condiciones || {}
  );
  drawTitle(page2, currentY, "6. Firmas", fontBold);
  currentY -= 25;
  drawFirmas(page2, currentY, font, fontBold);
  return await pdfDoc.save();
}

const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const cot = body?.cotizacion;
  const empresa = body?.empresa;
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
      "Cache-Control": "no-store"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
