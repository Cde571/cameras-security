import type { APIRoute } from "astro";
import { getSqlClient } from "../../../../lib/db/client";
import { jsonError, jsonOk } from "../../../../lib/server/api/response";

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = String(params.id ?? "");
    const sql = getSqlClient();

    const rows = await sql`
      SELECT
        id::text AS id,
        nombre,
        documento,
        telefono,
        email,
        direccion,
        ciudad,
        notas,
        coalesce(estado, 'activo') AS estado,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
      FROM clientes
      WHERE id = ${id}::uuid
      LIMIT 1
    `;

    if (!rows[0]) return jsonError("Cliente no encontrado", 404);
    return jsonOk({ item: rows[0] });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible consultar cliente");
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const id = String(params.id ?? "");
    const body = await request.json();
    const sql = getSqlClient();

    const current = await sql`SELECT * FROM clientes WHERE id = ${id}::uuid LIMIT 1`;
    if (!current[0]) return jsonError("Cliente no encontrado", 404);

    const row = current[0];

    const rows = await sql`
      UPDATE clientes
      SET
        nombre = ${body.nombre ?? row.nombre},
        documento = ${body.documento ?? row.documento},
        telefono = ${body.telefono ?? row.telefono},
        email = ${body.email ?? row.email},
        direccion = ${body.direccion ?? row.direccion},
        ciudad = ${body.ciudad ?? row.ciudad},
        notas = ${body.notas ?? row.notas},
        estado = ${body.estado ?? row.estado},
        updated_at = now()
      WHERE id = ${id}::uuid
      RETURNING
        id::text AS id,
        nombre,
        documento,
        telefono,
        email,
        direccion,
        ciudad,
        notas,
        coalesce(estado, 'activo') AS estado,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return jsonOk({ item: rows[0] });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible actualizar cliente");
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = String(params.id ?? "");
    const sql = getSqlClient();

    await sql`DELETE FROM clientes WHERE id = ${id}::uuid`;
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible eliminar cliente");
  }
};