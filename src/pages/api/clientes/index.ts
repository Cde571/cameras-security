import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";
import { jsonError, jsonOk } from "../../../lib/server/api/response";

export const GET: APIRoute = async ({ url }) => {
  try {
    const q = String(url.searchParams.get("q") ?? "").trim().toLowerCase();
    const sql = getSqlClient();

    const rows = q
      ? await sql`
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
          WHERE
            lower(coalesce(nombre, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(documento, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(telefono, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(email, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(ciudad, '')) LIKE ${`%${q}%`}
          ORDER BY coalesce(updated_at, created_at, now()) DESC
        `
      : await sql`
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
          ORDER BY coalesce(updated_at, created_at, now()) DESC
        `;

    return jsonOk({ items: rows });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible listar clientes");
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const sql = getSqlClient();

    if (!String(body?.nombre ?? "").trim()) {
      return jsonError("El nombre es obligatorio", 400);
    }

    const rows = await sql`
      INSERT INTO clientes (
        nombre, documento, telefono, email, direccion, ciudad, notas, estado
      )
      VALUES (
        ${String(body.nombre).trim()},
        ${body.documento ?? null},
        ${body.telefono ?? null},
        ${body.email ?? null},
        ${body.direccion ?? null},
        ${body.ciudad ?? null},
        ${body.notas ?? null},
        ${body.estado ?? 'activo'}
      )
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

    return jsonOk({ item: rows[0] }, 201);
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible crear cliente");
  }
};