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
      email,
      rol,
      activo,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM usuarios
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
    console.error("[api/config/usuarios][GET]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible listar usuarios",
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
    const nombre = String(body?.nombre ?? "Usuario").trim() || "Usuario";
    const email = String(body?.email ?? "").trim();
    const rol = String(body?.rol ?? "asesor").trim() || "asesor";
    const activo = Boolean(body?.activo ?? true);
    const password = typeof body?.password === "string" ? body.password : "";

    let row = null;

    if (id) {
      if (password.trim()) {
        const rows = await sql`
          UPDATE usuarios
          SET
            nombre = ${nombre},
            email = ${email},
            rol = ${rol},
            activo = ${activo},
            password_hash = ${password},
            updated_at = now()
          WHERE id = ${id}::uuid
          RETURNING
            id::text AS id,
            nombre,
            email,
            rol,
            activo,
            created_at::text AS "createdAt",
            updated_at::text AS "updatedAt"
        `;
        row = rows[0] ?? null;
      } else {
        const rows = await sql`
          UPDATE usuarios
          SET
            nombre = ${nombre},
            email = ${email},
            rol = ${rol},
            activo = ${activo},
            updated_at = now()
          WHERE id = ${id}::uuid
          RETURNING
            id::text AS id,
            nombre,
            email,
            rol,
            activo,
            created_at::text AS "createdAt",
            updated_at::text AS "updatedAt"
        `;
        row = rows[0] ?? null;
      }
    } else {
      const rows = await sql`
        INSERT INTO usuarios (
          nombre, email, password_hash, rol, activo
        ) VALUES (
          ${nombre}, ${email}, ${password}, ${rol}, ${activo}
        )
        RETURNING
          id::text AS id,
          nombre,
          email,
          rol,
          activo,
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
      `;
      row = rows[0] ?? null;
    }

    return json({ ok: true, item: row }, 200);
  } catch (error: any) {
    console.error("[api/config/usuarios][POST]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible guardar el usuario",
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
      return json({ ok: false, error: "Falta id del usuario" }, 400);
    }

    await sql`DELETE FROM usuarios WHERE id = ${id}::uuid`;
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("[api/config/usuarios][DELETE]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible eliminar el usuario",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};