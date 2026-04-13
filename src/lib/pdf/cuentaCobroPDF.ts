// src/lib/pdf/cotizacionPDF.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { calcTotales, type Cotizacion } from "../services/cotizacionLocalService";
import { A4, isoToDate, moneyCOP, wrapText } from "./templates";

export async function generateCotizacionPdfBytes(c: Cotizacion): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4.w, A4.h]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 42;

  // Colors
  const gray = rgb(0.25, 0.25, 0.27);
  const lightGray = rgb(0.92, 0.93, 0.95);
  const blue = rgb(0.12, 0.33, 0.75);

  // Header band
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: rgb(0.97, 0.98, 1),
  });
  page.drawLine({
    start: { x: 0, y: height - 110 },
    end: { x: width, y: height - 110 },
    thickness: 1,
    color: lightGray,
  });

  // Company (placeholder)
  page.drawText("TECHNOLOGICAL CAMERAS", {
    x: margin,
    y: height - 55,
    size: 16,
    font: fontBold,
    color: gray,
  });
  page.drawText("Sistemas de seguridad y videovigilancia", {
    x: margin,
    y: height - 74,
    size: 10,
    font,
    color: rgb(0.35, 0.35, 0.38),
  });

  // Doc meta (right)
  const rightX = width - margin - 230;
  page.drawText("COTIZACIÓN", {
    x: rightX,
    y: height - 50,
    size: 12,
    font: fontBold,
    color: blue,
  });
  page.drawText(`No: ${c.numero}`, {
    x: rightX,
    y: height - 68,
    size: 10,
    font: fontBold,
    color: gray,
  });
  page.drawText(`Fecha: ${isoToDate(c.fecha)}`, {
    x: rightX,
    y: height - 84,
    size: 10,
    font,
    color: gray,
  });
  page.drawText(`Vigencia: ${c.vigenciaDias} días`, {
    x: rightX,
    y: height - 100,
    size: 10,
    font,
    color: gray,
  });

  // Cliente block
  let y = height - 140;
  page.drawText("Cliente", { x: margin, y, size: 11, font: fontBold, color: gray });
  y -= 14;
  page.drawText(`${c.cliente?.nombre ?? ""}`, { x: margin, y, size: 10, font: fontBold, color: gray });
  y -= 13;

  const cliLine = [
    c.cliente?.documento ? `Doc: ${c.cliente.documento}` : "",
    c.cliente?.ciudad ? `Ciudad: ${c.cliente.ciudad}` : "",
    c.cliente?.telefono ? `Tel: ${c.cliente.telefono}` : "",
    c.cliente?.email ? `Email: ${c.cliente.email}` : "",
  ].filter(Boolean).join("  •  ");

  page.drawText(cliLine || "—", { x: margin, y, size: 9, font, color: rgb(0.35, 0.35, 0.38) });

  // Asunto
  y -= 22;
  if (c.asunto) {
    page.drawText("Asunto:", { x: margin, y, size: 9, font: fontBold, color: gray });
    page.drawText(c.asunto, { x: margin + 52, y, size: 9, font, color: gray });
  }

  // Table
  y -= 26;
  const tableTop = y;
  const col = {
    idx: margin,
    desc: margin + 28,
    qty: width - margin - 170,
    unit: width - margin - 120,
    iva: width - margin - 70,
    total: width - margin - 10,
  };

  // Header row bg
  page.drawRectangle({
    x: margin,
    y: tableTop,
    width: width - margin * 2,
    height: 22,
    color: lightGray,
  });

  page.drawText("#", { x: col.idx, y: tableTop + 7, size: 9, font: fontBold, color: gray });
  page.drawText("Descripción", { x: col.desc, y: tableTop + 7, size: 9, font: fontBold, color: gray });
  page.drawText("Cant", { x: col.qty, y: tableTop + 7, size: 9, font: fontBold, color: gray });
  page.drawText("Unit", { x: col.unit, y: tableTop + 7, size: 9, font: fontBold, color: gray });
  page.drawText("IVA", { x: col.iva, y: tableTop + 7, size: 9, font: fontBold, color: gray });
  page.drawText("Total", { x: col.total - 36, y: tableTop + 7, size: 9, font: fontBold, color: gray });

  let rowY = tableTop - 14;
  const rowHBase = 18;

  const items = c.items || [];
  items.forEach((it, i) => {
    const base = (it.precio || 0) * (it.qty || 0);
    const iva = base * ((it.ivaPct || 0) / 100);
    const total = base + iva;

    const descLines = wrapText(`${it.nombre}${it.kind ? ` (${it.kind})` : ""}`, 48);
    const rowH = Math.max(rowHBase, descLines.length * 11);

    // row separator
    page.drawLine({
      start: { x: margin, y: rowY - 6 },
      end: { x: width - margin, y: rowY - 6 },
      thickness: 0.6,
      color: lightGray,
    });

    page.drawText(String(i + 1), { x: col.idx, y: rowY, size: 9, font, color: gray });

    // description multi-line
    descLines.forEach((ln, k) => {
      page.drawText(ln, { x: col.desc, y: rowY - k * 11, size: 9, font, color: gray });
    });

    page.drawText(String(it.qty || 0), { x: col.qty + 10, y: rowY, size: 9, font, color: gray });
    page.drawText(moneyCOP(it.precio || 0), { x: col.unit - 10, y: rowY, size: 9, font, color: gray });
    page.drawText(`${it.ivaPct || 0}%`, { x: col.iva + 6, y: rowY, size: 9, font, color: gray });
    page.drawText(moneyCOP(total), { x: col.total - 100, y: rowY, size: 9, font: fontBold, color: gray });

    rowY -= rowH;
  });

  // Totals box
  const totals = calcTotales(items);
  const boxW = 260;
  const boxH = 68;
  const boxX = width - margin - boxW;
  const boxY = Math.max(120, rowY - 16);

  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxW,
    height: boxH,
    color: rgb(0.99, 0.99, 1),
    borderColor: lightGray,
    borderWidth: 1,
  });

  const lineY1 = boxY + boxH - 20;
  page.drawText("Subtotal", { x: boxX + 12, y: lineY1, size: 9, font, color: gray });
  page.drawText(moneyCOP(totals.subtotal), { x: boxX + 130, y: lineY1, size: 9, font: fontBold, color: gray });

  const lineY2 = lineY1 - 16;
  page.drawText("IVA", { x: boxX + 12, y: lineY2, size: 9, font, color: gray });
  page.drawText(moneyCOP(totals.iva), { x: boxX + 130, y: lineY2, size: 9, font: fontBold, color: gray });

  page.drawLine({
    start: { x: boxX + 12, y: lineY2 - 8 },
    end: { x: boxX + boxW - 12, y: lineY2 - 8 },
    thickness: 0.8,
    color: lightGray,
  });

  const lineY3 = lineY2 - 20;
  page.drawText("TOTAL", { x: boxX + 12, y: lineY3, size: 10, font: fontBold, color: blue });
  page.drawText(moneyCOP(totals.total), { x: boxX + 130, y: lineY3, size: 10, font: fontBold, color: blue });

  // Condiciones / notas
  let textY = boxY - 24;
  const bottomLimit = 75;

  const addBlock = (title: string, body: string) => {
    if (!body) return;
    if (textY < bottomLimit) return;

    page.drawText(title, { x: margin, y: textY, size: 10, font: fontBold, color: gray });
    textY -= 14;

    const lines = wrapText(body, 95);
    lines.forEach((ln) => {
      if (textY < bottomLimit) return;
      page.drawText(ln, { x: margin, y: textY, size: 9, font, color: rgb(0.35, 0.35, 0.38) });
      textY -= 12;
    });

    textY -= 6;
  };

  addBlock("Condiciones", c.condiciones || "");
  addBlock("Notas", c.notas || "");

  // Footer
  page.drawLine({
    start: { x: margin, y: 55 },
    end: { x: width - margin, y: 55 },
    thickness: 1,
    color: lightGray,
  });

  page.drawText("Este documento es una cotización. Precios en COP. No incluye trabajos no especificados.", {
    x: margin,
    y: 38,
    size: 8,
    font,
    color: rgb(0.45, 0.45, 0.48),
  });

  page.drawText("TechCameras • Medellín, Colombia", {
    x: margin,
    y: 24,
    size: 8,
    font,
    color: rgb(0.45, 0.45, 0.48),
  });

  return await pdfDoc.save();
}

// Alias para compatibilidad
export async function buildCotizacionPDF(c: Cotizacion): Promise<Uint8Array> {
  return generateCotizacionPdfBytes(c);
}