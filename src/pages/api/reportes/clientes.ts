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

    const hasClientes = await tableExists(sql, "clientes");
    const hasCotizaciones = await tableExists(sql, "cotizaciones");

    if (!hasClientes) {
      return json({ items: [] }, 200);
    }

    const hasClienteNombre = await columnExists(sql, "clientes", "nombre");
    const hasClienteIdEnCot = hasCotizaciones ? await columnExists(sql, "cotizaciones", "cliente_id") : false;
    const hasTotalEnCot = hasCotizaciones ? await columnExists(sql, "cotizaciones", "total") : false;

    if (hasCotizaciones && hasClienteNombre && hasClienteIdEnCot && hasTotalEnCot) {
      const rows = await sql`
        SELECT
          c.nombre AS name,
          count(ctz.id)::int AS count,
          COALESCE(sum(ctz.total), 0)::numeric AS total
        FROM clientes c
        LEFT JOIN cotizaciones ctz ON ctz.cliente_id = c.id
        GROUP BY c.id, c.nombre
        ORDER BY COALESCE(sum(ctz.total), 0) DESC, count(ctz.id) DESC, c.nombre ASC
        LIMIT 10
      `;

      return json({
        items: rows.map((r: any) => ({
          name: String(r.name ?? "Cliente"),
          count: Number(r.count || 0),
          total: Number(r.total || 0),
        })),
      }, 200);
    }

    if (hasClienteNombre) {
      const rows = await sql`
        SELECT
          nombre AS name,
          0::int AS count,
          0::numeric AS total
        FROM clientes
        ORDER BY coalesce(updated_at, created_at, now()) DESC
        LIMIT 10
      `;

      return json({
        items: rows.map((r: any) => ({
          name: String(r.name ?? "Cliente"),
          count: Number(r.count || 0),
          total: Number(r.total || 0),
        })),
      }, 200);
    }

    return json({ items: [] }, 200);
  } catch (error: any) {
    console.error("[api/reportes/clientes][GET]", error);
    return json({
      error: error?.message || "No fue posible cargar el reporte de clientes",
      code: error?.code || null,
      detail: error?.detail || null,
      items: [],
    }, 500);
  }
};