import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type ActaActivo = {
  id?: string;
  nombre: string;
  serial?: string;
  ubicacion?: string;
  estado?: string;
};

export type ActaPayload = {
  numero: string;
  fecha: string;
  cliente?: {
    nombre?: string;
    documento?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
  };
  proyecto?: string;
  ordenRef?: string;
  activos: ActaActivo[];
  observaciones?: string;
  acuerdos?: string;
};

export type CompanyInfo = {
  nombre?: string;
  nit?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  logoUrl?: string;
};

export type PdfTheme = {
  primary?: [number, number, number];
};

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

export async function buildActaPDF(
  payload: ActaPayload,
  company: CompanyInfo = {},
  _opts?: { theme?: PdfTheme }
): Promise<Uint8Array> {
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
  const border = rgb(0.85, 0.87, 0.90);

  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: light,
  });

  page.drawLine({
    start: { x: 0, y: height - 110 },
    end: { x: width, y: height - 110 },
    thickness: 1,
    color: border,
  });

  page.drawText(company.nombre || "Technological Cameras", {
    x: margin,
    y: height - 48,
    size: 17,
    font: bold,
    color: dark,
  });

  const companyLine1 = [
    company.nit ? `NIT: ${company.nit}` : "",
    company.telefono ? `Tel: ${company.telefono}` : "",
  ].filter(Boolean).join("  •  ");

  const companyLine2 = [
    company.email || "",
    company.direccion || "",
    company.ciudad || "",
  ].filter(Boolean).join("  •  ");

  if (companyLine1) {
    page.drawText(companyLine1, {
      x: margin,
      y: height - 66,
      size: 9,
      font,
      color: gray,
    });
  }

  if (companyLine2) {
    page.drawText(companyLine2, {
      x: margin,
      y: height - 80,
      size: 9,
      font,
      color: gray,
    });
  }

  const rightX = width - margin - 190;

  page.drawText("ACTA DE ENTREGA", {
    x: rightX,
    y: height - 50,
    size: 13,
    font: bold,
    color: blue,
  });

  page.drawText(`No: ${payload.numero || "-"}`, {
    x: rightX,
    y: height - 68,
    size: 10,
    font: bold,
    color: dark,
  });

  page.drawText(`Fecha: ${formatDateES(payload.fecha)}`, {
    x: rightX,
    y: height - 84,
    size: 9,
    font,
    color: gray,
  });

  if (payload.ordenRef) {
    page.drawText(`Orden: ${payload.ordenRef}`, {
      x: rightX,
      y: height - 98,
      size: 9,
      font,
      color: gray,
    });
  }

  let y = height - 145;

  page.drawText("Cliente", {
    x: margin,
    y,
    size: 11,
    font: bold,
    color: dark,
  });

  y -= 16;

  page.drawText(payload.cliente?.nombre || "-", {
    x: margin,
    y,
    size: 10,
    font: bold,
    color: dark,
  });

  y -= 14;

  const clienteLinea = [
    payload.cliente?.documento ? `Doc/NIT: ${payload.cliente.documento}` : "",
    payload.cliente?.telefono ? `Tel: ${payload.cliente.telefono}` : "",
    payload.cliente?.email ? `Email: ${payload.cliente.email}` : "",
    payload.cliente?.ciudad ? `Ciudad: ${payload.cliente.ciudad}` : "",
  ].filter(Boolean).join("  •  ");

  page.drawText(clienteLinea || "-", {
    x: margin,
    y,
    size: 9,
    font,
    color: gray,
  });

  y -= 18;

  if (payload.proyecto) {
    page.drawText(`Proyecto: ${payload.proyecto}`, {
      x: margin,
      y,
      size: 9,
      font,
      color: gray,
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
    color: light,
  });

  page.drawText("Activo", {
    x: colDesc,
    y: y + 7,
    size: 9,
    font: bold,
    color: dark,
  });

  page.drawText("Serial", {
    x: colSerial,
    y: y + 7,
    size: 9,
    font: bold,
    color: dark,
  });

  page.drawText("Ubicación", {
    x: colUbic,
    y: y + 7,
    size: 9,
    font: bold,
    color: dark,
  });

  page.drawText("Estado", {
    x: colEstado,
    y: y + 7,
    size: 9,
    font: bold,
    color: dark,
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
      color: border,
    });

    nombreLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colDesc,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: dark,
      });
    });

    serialLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colSerial,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: dark,
      });
    });

    ubicLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colUbic,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: dark,
      });
    });

    estadoLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colEstado,
        y: rowY - idx * 11,
        size: 9,
        font,
        color: dark,
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
      color: dark,
    });

    textY -= 14;

    for (const line of wrapText(payload.observaciones, 95)) {
      page.drawText(line, {
        x: margin,
        y: textY,
        size: 9,
        font,
        color: gray,
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
      color: dark,
    });

    textY -= 14;

    for (const line of wrapText(payload.acuerdos, 95)) {
      page.drawText(line, {
        x: margin,
        y: textY,
        size: 9,
        font,
        color: gray,
      });
      textY -= 12;
    }
  }

  const signY = 85;

  page.drawLine({
    start: { x: margin + 10, y: signY },
    end: { x: margin + 200, y: signY },
    thickness: 1,
    color: border,
  });

  page.drawLine({
    start: { x: width - margin - 200, y: signY },
    end: { x: width - margin - 10, y: signY },
    thickness: 1,
    color: border,
  });

  page.drawText("Entrega / Técnico", {
    x: margin + 55,
    y: signY - 16,
    size: 9,
    font,
    color: gray,
  });

  page.drawText("Recibe / Cliente", {
    x: width - margin - 145,
    y: signY - 16,
    size: 9,
    font,
    color: gray,
  });

  page.drawLine({
    start: { x: margin, y: 48 },
    end: { x: width - margin, y: 48 },
    thickness: 1,
    color: border,
  });

  page.drawText("Documento generado automáticamente desde el módulo de actas.", {
    x: margin,
    y: 32,
    size: 8,
    font,
    color: gray,
  });

  return await doc.save();
}
