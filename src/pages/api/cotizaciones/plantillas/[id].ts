import type { APIRoute } from "astro";
import { getSqlClient } from "../../../../lib/db/client";

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");
    const body = await request.json();

    const current = await sql`
      SELECT * FROM cotizacion_plantillas
      WHERE id = ${id}::uuid
      LIMIT 1
    `;

    if (!current[0]) {
      return new Response(JSON.stringify({
        ok: false,
        error: "Plantilla no encontrada"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const row = current[0];

    const rows = await sql`
      UPDATE cotizacion_plantillas
      SET
        nombre = ${body.nombre ?? row.nombre},
        cuerpo = ${body.cuerpo ?? row.cuerpo},
        activo = ${body.activo ?? row.activo},
        updated_at = now()
      WHERE id = ${id}::uuid
      RETURNING
        id::text AS id,
        nombre,
        cuerpo,
        coalesce(activo, true) AS activo,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return new Response(JSON.stringify({
      ok: true,
      item: rows[0]
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error?.message || "No fue posible actualizar plantilla"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");

    await sql`
      DELETE FROM cotizacion_plantillas
      WHERE id = ${id}::uuid
    `;

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error?.message || "No fue posible eliminar plantilla"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};