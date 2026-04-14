import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { CuentaCobro } from "../services/cobroPagoLocalService";
import type { EmpresaConfig } from "../services/configLocalService";

function moneyCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function formatDateES(value?: string) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function wrapText(text: string, maxChars: number): string[] {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
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

export type CuentaCobroPDFOptions = {
  empresa?: Partial<EmpresaConfig>;
  plantillaTexto?: string;
  firmaEmisor?: string;
  firmaCliente?: string;
};

export async function generateCuentaCobroPdfBytes(
  cobro: CuentaCobro,
  options: CuentaCobroPDFOptions = {}
): Promise<Uint8Array> {
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
    border: rgb(0.85, 0.87, 0.90),
  };

  const empresa = {
    nombre: options.empresa?.nombre || "Technological Cameras",
    nit: options.empresa?.nit || "",
    telefono: options.empresa?.telefono || "",
    email: options.empresa?.email || "",
    direccion: options.empresa?.direccion || "",
    ciudad: options.empresa?.ciudad || "",
    website: options.empresa?.website || "",
  };

  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: colors.softBlue,
  });

  page.drawLine({
    start: { x: 0, y: height - 110 },
    end: { x: width, y: height - 110 },
    thickness: 1,
    color: colors.border,
  });

  page.drawText(empresa.nombre, {
    x: margin,
    y: height - 50,
    size: 17,
    font: fontBold,
    color: colors.dark,
  });

  const empresaLine1 = [empresa.nit ? `NIT: ${empresa.nit}` : "", empresa.telefono ? `Tel: ${empresa.telefono}` : ""]
    .filter(Boolean)
    .join("  •  ");

  const empresaLine2 = [empresa.email, empresa.direccion, empresa.ciudad, empresa.website]
    .filter(Boolean)
    .join("  •  ");

  if (empresaLine1) {
    page.drawText(empresaLine1, {
      x: margin,
      y: height - 67,
      size: 9,
      font,
      color: colors.gray,
    });
  }

  if (empresaLine2) {
    page.drawText(empresaLine2, {
      x: margin,
      y: height - 81,
      size: 9,
      font,
      color: colors.gray,
    });
  }

  const rightX = width - margin - 190;

  page.drawText("CUENTA DE COBRO", {
    x: rightX,
    y: height - 50,
    size: 13,
    font: fontBold,
    color: colors.blue,
  });

  page.drawText(`No: ${cobro.numero}`, {
    x: rightX,
    y: height - 68,
    size: 10,
    font: fontBold,
    color: colors.dark,
  });

  page.drawText(`Emisión: ${formatDateES(cobro.fechaEmision)}`, {
    x: rightX,
    y: height - 84,
    size: 9,
    font,
    color: colors.gray,
  });

  page.drawText(`Vencimiento: ${formatDateES(cobro.fechaVencimiento)}`, {
    x: rightX,
    y: height - 98,
    size: 9,
    font,
    color: colors.gray,
  });

  let y = height - 145;

  page.drawText("Cliente", {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: colors.dark,
  });

  y -= 16;

  page.drawText(cobro.cliente?.nombre || "-", {
    x: margin,
    y,
    size: 10,
    font: fontBold,
    color: colors.dark,
  });

  y -= 14;

  const clienteLine = [
    cobro.cliente?.documento ? `Doc/NIT: ${cobro.cliente.documento}` : "",
    cobro.cliente?.telefono ? `Tel: ${cobro.cliente.telefono}` : "",
    cobro.cliente?.email ? `Email: ${cobro.cliente.email}` : "",
    cobro.cliente?.ciudad ? `Ciudad: ${cobro.cliente.ciudad}` : "",
  ].filter(Boolean).join("  •  ");

  page.drawText(clienteLine || "-", {
    x: margin,
    y,
    size: 9,
    font,
    color: colors.gray,
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
    color: colors.light,
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
      color: colors.border,
    });

    descLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colDesc,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: colors.dark,
      });
    });

    page.drawText(String(item.cantidad || 0), {
      x: colCant + 6,
      y: rowY,
      size: 9,
      font,
      color: colors.dark,
    });

    page.drawText(moneyCOP(item.unitario || 0), {
      x: colUnit - 8,
      y: rowY,
      size: 9,
      font,
      color: colors.dark,
    });

    page.drawText(`${item.ivaPct || 0}%`, {
      x: colIva + 6,
      y: rowY,
      size: 9,
      font,
      color: colors.dark,
    });

    page.drawText(moneyCOP(total), {
      x: colTotal - 96,
      y: rowY,
      size: 9,
      font: fontBold,
      color: colors.dark,
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
    borderWidth: 1,
  });

  page.drawText("Subtotal", {
    x: totalsBoxX + 12,
    y: totalsBoxY + 49,
    size: 9,
    font,
    color: colors.dark,
  });

  page.drawText(moneyCOP(cobro.subtotal || 0), {
    x: totalsBoxX + 110,
    y: totalsBoxY + 49,
    size: 9,
    font: fontBold,
    color: colors.dark,
  });

  page.drawText("IVA", {
    x: totalsBoxX + 12,
    y: totalsBoxY + 32,
    size: 9,
    font,
    color: colors.dark,
  });

  page.drawText(moneyCOP(cobro.iva || 0), {
    x: totalsBoxX + 110,
    y: totalsBoxY + 32,
    size: 9,
    font: fontBold,
    color: colors.dark,
  });

  page.drawLine({
    start: { x: totalsBoxX + 12, y: totalsBoxY + 23 },
    end: { x: totalsBoxX + totalsBoxW - 12, y: totalsBoxY + 23 },
    thickness: 0.8,
    color: colors.border,
  });

  page.drawText("TOTAL", {
    x: totalsBoxX + 12,
    y: totalsBoxY + 8,
    size: 10,
    font: fontBold,
    color: colors.blue,
  });

  page.drawText(moneyCOP(cobro.total || 0), {
    x: totalsBoxX + 110,
    y: totalsBoxY + 8,
    size: 10,
    font: fontBold,
    color: colors.blue,
  });

  let textY = totalsBoxY - 24;

  if (cobro.observaciones) {
    page.drawText("Observaciones", {
      x: margin,
      y: textY,
      size: 10,
      font: fontBold,
      color: colors.dark,
    });

    textY -= 14;

    for (const line of wrapText(cobro.observaciones, 95)) {
      page.drawText(line, {
        x: margin,
        y: textY,
        size: 9,
        font,
        color: colors.gray,
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
      color: colors.dark,
    });

    textY -= 14;

    for (const line of wrapText(options.plantillaTexto, 95)) {
      page.drawText(line, {
        x: margin,
        y: textY,
        size: 9,
        font,
        color: colors.gray,
      });
      textY -= 12;
    }
  }

  const signY = 85;

  page.drawLine({
    start: { x: margin + 10, y: signY },
    end: { x: margin + 200, y: signY },
    thickness: 1,
    color: colors.border,
  });

  page.drawLine({
    start: { x: width - margin - 200, y: signY },
    end: { x: width - margin - 10, y: signY },
    thickness: 1,
    color: colors.border,
  });

  page.drawText(options.firmaEmisor || empresa.nombre || "Emisor", {
    x: margin + 20,
    y: signY - 16,
    size: 9,
    font,
    color: colors.gray,
  });

  page.drawText(options.firmaCliente || cobro.cliente?.nombre || "Cliente", {
    x: width - margin - 155,
    y: signY - 16,
    size: 9,
    font,
    color: colors.gray,
  });

  page.drawLine({
    start: { x: margin, y: 48 },
    end: { x: width - margin, y: 48 },
    thickness: 1,
    color: colors.border,
  });

  page.drawText("Documento generado automáticamente desde el módulo de cuentas de cobro.", {
    x: margin,
    y: 32,
    size: 8,
    font,
    color: colors.gray,
  });

  return await pdfDoc.save();
}

export async function buildCuentaCobroPDF(
  cobro: CuentaCobro,
  options: CuentaCobroPDFOptions = {}
): Promise<Uint8Array> {
  return generateCuentaCobroPdfBytes(cobro, options);
}
