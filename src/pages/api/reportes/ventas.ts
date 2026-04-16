import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function tableExists(sql: any, tableName: string) {
  const rows = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ${tableName}
    ) AS ok
  `;
  return Boolean(rows[0]?.ok);
}

async function columnExists(sql: any, tableName: string, columnName: string) {
  const rows = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ${tableName}
        AND column_name = ${columnName}
    ) AS ok
  `;
  return Boolean(rows[0]?.ok);
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();

    const hasCotizaciones = await tableExists(sql, "cotizaciones");
    if (!hasCotizaciones) {
      return json({ items: [] }, 200);
    }

    const hasFecha = await columnExists(sql, "cotizaciones", "fecha");
    const hasTotal = await columnExists(sql, "cotizaciones", "total");

    if (!hasFecha || !hasTotal) {
      return json({ items: [] }, 200);
    }

    const rows = await sql`
      SELECT
        to_char(date_trunc('month', fecha::date), 'YYYY-MM') AS periodo,
        count(*)::int AS cantidad,
        COALESCE(sum(total), 0)::numeric AS total
      FROM cotizaciones
      GROUP BY date_trunc('month', fecha::date)
      ORDER BY date_trunc('month', fecha::date) ASC
    `;

    return json({
      items: rows.map((r: any) => ({
        periodo: r.periodo,
        cantidad: Number(r.cantidad || 0),
        total: Number(r.total || 0),
      })),
    }, 200);
  } catch (error: any) {
    console.error("[api/reportes/ventas][GET]", error);
    return json({
      error: error?.message || "No fue posible cargar el reporte de ventas",
      code: error?.code || null,
      detail: error?.detail || null,
      items: [],
    }, 500);
  }
};