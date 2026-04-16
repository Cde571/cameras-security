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

    const hasProductos = await tableExists(sql, "productos");
    const hasItems = await tableExists(sql, "cotizacion_items");

    if (!hasProductos && !hasItems) {
      return json({ items: [] }, 200);
    }

    const hasProductoId = hasItems ? await columnExists(sql, "cotizacion_items", "producto_id") : false;
    const hasSubtotal = hasItems ? await columnExists(sql, "cotizacion_items", "subtotal") : false;
    const hasDescripcion = hasItems ? await columnExists(sql, "cotizacion_items", "descripcion") : false;
    const hasNombreProducto = hasProductos ? await columnExists(sql, "productos", "nombre") : false;

    if (hasItems && hasSubtotal && (hasProductoId || hasDescripcion)) {
      const rows = await sql`
        SELECT
          COALESCE(p.nombre, ci.descripcion, 'Producto sin nombre') AS name,
          count(*)::int AS count,
          COALESCE(sum(ci.subtotal), 0)::numeric AS total
        FROM cotizacion_items ci
        LEFT JOIN productos p ON p.id = ci.producto_id
        GROUP BY COALESCE(p.nombre, ci.descripcion, 'Producto sin nombre')
        ORDER BY COALESCE(sum(ci.subtotal), 0) DESC, count(*) DESC
        LIMIT 10
      `;

      return json({
        items: rows.map((r: any) => ({
          name: String(r.name ?? "Producto sin nombre"),
          count: Number(r.count || 0),
          total: Number(r.total || 0),
        })),
      }, 200);
    }

    if (hasProductos && hasNombreProducto) {
      const rows = await sql`
        SELECT
          nombre AS name,
          0::int AS count,
          0::numeric AS total
        FROM productos
        ORDER BY coalesce(updated_at, created_at, now()) DESC
        LIMIT 10
      `;

      return json({
        items: rows.map((r: any) => ({
          name: String(r.name ?? "Producto"),
          count: Number(r.count || 0),
          total: Number(r.total || 0),
        })),
      }, 200);
    }

    return json({ items: [] }, 200);
  } catch (error: any) {
    console.error("[api/reportes/productos][GET]", error);
    return json({
      error: error?.message || "No fue posible cargar el reporte de productos",
      code: error?.code || null,
      detail: error?.detail || null,
      items: [],
    }, 500);
  }
};