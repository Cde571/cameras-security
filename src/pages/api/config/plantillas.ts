import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function listRows(sql: any) {
  const rows = await sql`
    SELECT
      id::text AS id,
      nombre,
      tipo,
      contenido,
      activo,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM plantillas_config
    ORDER BY tipo ASC, nombre ASC, created_at ASC
  `;
  return rows;
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();
    const rows = await listRows(sql);
    return json({ ok: true, items: rows }, 200);
  } catch (error: any) {
    console.error("[api/config/plantillas][GET]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible listar plantillas",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();

    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const nombre = String(body?.nombre ?? "Plantilla").trim() || "Plantilla";
    const tipo = String(body?.tipo ?? "general").trim() || "general";
    const contenido = String(body?.contenido ?? "");
    const activo = Boolean(body?.activo ?? true);

    let row = null;

    if ($id) {
      const rows = await sql`
        UPDATE plantillas_config
        SET
          nombre = ${nombre},
          tipo = ${tipo},
          contenido = ${contenido},
          activo = ${activo},
          updated_at = now()
        WHERE id = ${id}::uuid
        RETURNING
          id::text AS id,
          nombre,
          tipo,
          contenido,
          activo,
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
      `;
      row = rows[0] ?? null;
    } else {
      const rows = await sql`
        INSERT INTO plantillas_config (
          nombre, tipo, contenido, activo
        ) VALUES (
          ${nombre}, ${tipo}, ${contenido}, ${activo}
        )
        RETURNING
          id::text AS id,
          nombre,
          tipo,
          contenido,
          activo,
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
      `;
      row = rows[0] ?? null;
    }

    return json({ ok: true, item: row }, 200);
  } catch (error: any) {
    console.error("[api/config/plantillas][POST]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible guardar la plantilla",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id.trim() : "";

    if (!id) {
      return json({ ok: false, error: "Falta id de la plantilla" }, 400);
    }

    await sql`DELETE FROM plantillas_config WHERE id = ${id}::uuid`;
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("[api/config/plantillas][DELETE]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible eliminar la plantilla",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};