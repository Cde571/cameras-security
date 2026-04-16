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

    if (!hasProductos) {
      return json({ items: [] }, 200);
    }

    const hasCategoria = await columnExists(sql, "productos", "categoria");
    const hasCosto = await columnExists(sql, "productos", "costo");
    const hasPrecio = await columnExists(sql, "productos", "precio");

    const hasProductoId = hasItems ? await columnExists(sql, "cotizacion_items", "producto_id") : false;
    const hasCantidad = hasItems ? await columnExists(sql, "cotizacion_items", "cantidad") : false;
    const hasSubtotal = hasItems ? await columnExists(sql, "cotizacion_items", "subtotal") : false;

    if (hasItems && hasCategoria && hasCosto && hasProductoId && hasCantidad && hasSubtotal) {
      const rows = await sql`
        SELECT
          COALESCE(NULLIF(p.categoria, ''), 'Sin categoría') AS category,
          COALESCE(sum(ci.subtotal), 0)::numeric AS revenue,
          COALESCE(sum(COALESCE(ci.cantidad, 0) * COALESCE(p.costo, 0)), 0)::numeric AS cost
        FROM cotizacion_items ci
        LEFT JOIN productos p ON p.id = ci.producto_id
        GROUP BY COALESCE(NULLIF(p.categoria, ''), 'Sin categoría')
        ORDER BY COALESCE(sum(ci.subtotal), 0) DESC
      `;

      return json({
        items: rows.map((r: any) => {
          const revenue = Number(r.revenue || 0);
          const cost = Number(r.cost || 0);
          const profit = revenue - cost;
          const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;

          return {
            category: String(r.category ?? "Sin categoría"),
            revenue,
            cost,
            profit,
            marginPct: Number(marginPct.toFixed(2)),
          };
        }),
      }, 200);
    }

    if (hasCategoria && hasCosto && hasPrecio) {
      const rows = await sql`
        SELECT
          COALESCE(NULLIF(categoria, ''), 'Sin categoría') AS category,
          COALESCE(sum(precio), 0)::numeric AS revenue,
          COALESCE(sum(costo), 0)::numeric AS cost
        FROM productos
        GROUP BY COALESCE(NULLIF(categoria, ''), 'Sin categoría')
        ORDER BY COALESCE(sum(precio), 0) DESC
      `;

      return json({
        items: rows.map((r: any) => {
          const revenue = Number(r.revenue || 0);
          const cost = Number(r.cost || 0);
          const profit = revenue - cost;
          const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;

          return {
            category: String(r.category ?? "Sin categoría"),
            revenue,
            cost,
            profit,
            marginPct: Number(marginPct.toFixed(2)),
          };
        }),
      }, 200);
    }

    return json({ items: [] }, 200);
  } catch (error: any) {
    console.error("[api/reportes/margenes][GET]", error);
    return json({
      error: error?.message || "No fue posible cargar el reporte de márgenes",
      code: error?.code || null,
      detail: error?.detail || null,
      items: [],
    }, 500);
  }
};