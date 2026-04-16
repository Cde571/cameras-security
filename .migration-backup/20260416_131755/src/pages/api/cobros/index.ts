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
            cc.id::text AS id,
            cc.numero,
            cc.cliente_id::text AS "clienteId",
            json_build_object(
              'id', c.id::text,
              'nombre', c.nombre,
              'documento', c.documento,
              'telefono', c.telefono,
              'email', c.email,
              'direccion', c.direccion,
              'ciudad', c.ciudad
            ) AS cliente,
            coalesce(cc.fecha::text, now()::date::text) AS "fechaEmision",
            coalesce(cc.fecha_vencimiento::text, now()::date::text) AS "fechaVencimiento",
            coalesce(cc.status, 'pendiente') AS status,
            '[]'::json AS servicios,
            cc.notas AS observaciones,
            coalesce(cc.subtotal, 0)::float AS subtotal,
            coalesce(cc.iva, 0)::float AS iva,
            coalesce(cc.total, 0)::float AS total,
            cc.created_at::text AS "createdAt",
            cc.updated_at::text AS "updatedAt"
          FROM cuentas_cobro cc
          LEFT JOIN clientes c ON c.id = cc.cliente_id
          WHERE
            lower(coalesce(cc.numero, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(c.nombre, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(c.documento, '')) LIKE ${`%${q}%`}
          ORDER BY coalesce(cc.updated_at, cc.created_at, now()) DESC
        `
      : await sql`
          SELECT
            cc.id::text AS id,
            cc.numero,
            cc.cliente_id::text AS "clienteId",
            json_build_object(
              'id', c.id::text,
              'nombre', c.nombre,
              'documento', c.documento,
              'telefono', c.telefono,
              'email', c.email,
              'direccion', c.direccion,
              'ciudad', c.ciudad
            ) AS cliente,
            coalesce(cc.fecha::text, now()::date::text) AS "fechaEmision",
            coalesce(cc.fecha_vencimiento::text, now()::date::text) AS "fechaVencimiento",
            coalesce(cc.status, 'pendiente') AS status,
            '[]'::json AS servicios,
            cc.notas AS observaciones,
            coalesce(cc.subtotal, 0)::float AS subtotal,
            coalesce(cc.iva, 0)::float AS iva,
            coalesce(cc.total, 0)::float AS total,
            cc.created_at::text AS "createdAt",
            cc.updated_at::text AS "updatedAt"
          FROM cuentas_cobro cc
          LEFT JOIN clientes c ON c.id = cc.cliente_id
          ORDER BY coalesce(cc.updated_at, cc.created_at, now()) DESC
        `;

    return jsonOk({ items: rows });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible listar cobros");
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const sql = getSqlClient();

    if (!body?.clienteId) return jsonError("clienteId es obligatorio", 400);

    const seqRows = await sql`
      SELECT count(*)::int + 1 as next
      FROM cuentas_cobro
      WHERE date_part('year', coalesce(created_at, now())) = date_part('year', now())
    `;
    const next = Number(seqRows?.[0]?.next ?? 1);
    const year = new Date().getFullYear();
    const numero = `CC-${year}-${String(next).padStart(4, "0")}`;

    const rows = await sql`
      INSERT INTO cuentas_cobro (
        numero, cliente_id, fecha, fecha_vencimiento, status, notas, subtotal, iva, total
      )
      VALUES (
        ${numero},
        ${body.clienteId}::uuid,
        ${body.fechaEmision ?? new Date().toISOString().slice(0, 10)},
        ${body.fechaVencimiento ?? new Date().toISOString().slice(0, 10)},
        ${body.status ?? 'pendiente'},
        ${body.observaciones ?? null},
        ${body.subtotal ?? 0},
        ${body.iva ?? 0},
        ${body.total ?? 0}
      )
      RETURNING
        id::text AS id,
        numero,
        cliente_id::text AS "clienteId",
        coalesce(fecha::text, now()::date::text) AS "fechaEmision",
        coalesce(fecha_vencimiento::text, now()::date::text) AS "fechaVencimiento",
        coalesce(status, 'pendiente') AS status,
        notas AS observaciones,
        coalesce(subtotal, 0)::float AS subtotal,
        coalesce(iva, 0)::float AS iva,
        coalesce(total, 0)::float AS total,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return jsonOk({ item: rows[0] }, 201);
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible crear cobro");
  }
};