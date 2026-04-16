import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();

    const rows = await sql`
      SELECT
        id::text AS id,
        nombre,
        cuerpo,
        coalesce(activo, true) AS activo,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM cotizacion_plantillas
      WHERE coalesce(activo, true) = true
      ORDER BY nombre ASC
    `;

    return json({ ok: true, items: rows });
  } catch (error: any) {
    console.error("[api/cotizaciones/plantillas][GET]", error);
    return json({ ok: false, error: error?.message || "No fue posible listar plantillas" }, 500);
  }
};