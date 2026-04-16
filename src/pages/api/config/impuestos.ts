import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function toNumber(value: any, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function listRows(sql: any) {
  const rows = await sql`
    SELECT
      id::text AS id,
      nombre,
      descripcion,
      porcentaje,
      activo,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM impuestos_config
    ORDER BY nombre ASC, created_at ASC
  `;
  return rows;
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();
    const rows = await listRows(sql);
    return json({ ok: true, items: rows }, 200);
  } catch (error: any) {
    console.error("[api/config/impuestos][GET]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible listar impuestos",
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
    const nombre = String(body?.nombre ?? "Impuesto").trim() || "Impuesto";
    const descripcion = String(body?.descripcion ?? "");
    const porcentaje = toNumber(body?.porcentaje, 0);
    const activo = Boolean(body?.activo ?? true);

    let row = null;

    if (id) {
      const rows = await sql`
        UPDATE impuestos_config
        SET
          nombre = ${nombre},
          descripcion = ${descripcion},
          porcentaje = ${porcentaje},
          activo = ${activo},
          updated_at = now()
        WHERE id = ${id}::uuid
        RETURNING
          id::text AS id,
          nombre,
          descripcion,
          porcentaje,
          activo,
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
      `;
      row = rows[0] ?? null;
    } else {
      const rows = await sql`
        INSERT INTO impuestos_config (
          nombre, descripcion, porcentaje, activo
        ) VALUES (
          ${nombre}, ${descripcion}, ${porcentaje}, ${activo}
        )
        RETURNING
          id::text AS id,
          nombre,
          descripcion,
          porcentaje,
          activo,
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
      `;
      row = rows[0] ?? null;
    }

    return json({ ok: true, item: row }, 200);
  } catch (error: any) {
    console.error("[api/config/impuestos][POST]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible guardar el impuesto",
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
      return json({ ok: false, error: "Falta id del impuesto" }, 400);
    }

    await sql`DELETE FROM impuestos_config WHERE id = ${id}::uuid`;
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("[api/config/impuestos][DELETE]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible eliminar el impuesto",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};