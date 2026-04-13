// src/lib/pdf/actaPDF.ts
import type { CompanyInfo, PdfTheme } from "./templates";
import {
  createPdfBase,
  drawCompanyHeader,
  drawKVGrid,
  drawParagraph,
  drawSignatures,
  drawTableHeader,
  drawTableRow,
  embedLogo,
  ensureSpace,
  formatDateES,
  themeDefault,
  type TableColumn,
  A4,
} from "./templates";

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
  proyecto?: string; // ej: "Instalación CCTV"
  ordenRef?: string; // ej: "OT-2026-123"
  activos: ActaActivo[];
  observaciones?: string;
  acuerdos?: string;
};

export async function buildActaPDF(payload: ActaPayload, company: CompanyInfo, opts?: { theme?: PdfTheme }) {
  const ctx = await createPdfBase({ theme: opts?.theme ?? themeDefault, margin: 40 });

  const logo = await embedLogo(ctx.doc, company.logoUrl);

  drawCompanyHeader(ctx, company, "ACTA DE ENTREGA", [
    `No: ${payload.numero}`,
    `Fecha: ${formatDateES(payload.fecha)}`,
    payload.ordenRef ? `Orden: ${payload.ordenRef}` : "",
  ].filter(Boolean));

  if (logo) {
    const x = ctx.margin + 14;
    const y = A4.h - ctx.margin - 66;
    const maxW = 70;
    const maxH = 40;
    const s = Math.min(maxW / logo.width, maxH / logo.height);
    ctx.page.drawImage(logo, { x, y, width: logo.width * s, height: logo.height * s });
  }

  const cliente = payload.cliente ?? {};
  drawKVGrid(
    ctx,
    [
      ["Cliente", cliente.nombre ?? "—"],
      ["NIT/CC", cliente.documento ?? "—"],
      ["Ciudad", cliente.ciudad ?? "—"],
      ["Teléfono", cliente.telefono ?? "—"],
      ["Email", cliente.email ?? "—"],
      ["Dirección", cliente.direccion ?? "—"],
    ],
    { cols: 3, rowHeight: 34 }
  );

  if (payload.proyecto?.trim()) drawParagraph(ctx, "Proyecto / Servicio", payload.proyecto);

  const tableW = A4.w - ctx.margin * 2;
  const cols: TableColumn[] = [
    { key: "n", label: "#", width: 24, align: "center" },
    { key: "nombre", label: "Activo / Elemento", width: tableW - (24 + 110 + 140 + 70), align: "left" },
    { key: "serial", label: "Serial", width: 110, align: "left" },
    { key: "ubic", label: "Ubicación", width: 140, align: "left" },
    { key: "estado", label: "Estado", width: 70, align: "left" },
  ];

  ensureSpace(ctx, 70);
  drawTableHeader(ctx, cols);

  const redrawHeader = () => drawTableHeader(ctx, cols);

  (payload.activos ?? []).forEach((a, idx) => {
    ensureSpace(ctx, 28, redrawHeader);

    drawTableRow(ctx, cols, {
      n: String(idx + 1),
      nombre: a.nombre ?? "",
      serial: a.serial ?? "—",
      ubic: a.ubicacion ?? "—",
      estado: a.estado ?? "OK",
    });
  });

  ctx.y -= 10;

  if (payload.acuerdos?.trim()) drawParagraph(ctx, "Acuerdos", payload.acuerdos);
  if (payload.observaciones?.trim()) drawParagraph(ctx, "Observaciones", payload.observaciones);

  drawSignatures(ctx, company.nombre ?? "Proveedor", cliente.nombre ?? "Cliente");

  return await ctx.doc.save();
}
