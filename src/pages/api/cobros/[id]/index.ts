import type { APIRoute } from "astro";
import { getSqlClient } from "../../../../lib/db/client";
import { jsonError, jsonOk } from "../../../../lib/server/api/response";

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = String(params.id ?? "");
    const sql = getSqlClient();

    const rows = await sql`
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
      WHERE cc.id = ${id}::uuid
      LIMIT 1
    `;

    if (!rows[0]) return jsonError("Cobro no encontrado", 404);
    return jsonOk({ item: rows[0] });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible consultar cobro");
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const id = String(params.id ?? "");
    const body = await request.json();
    const sql = getSqlClient();

    const current = await sql`SELECT * FROM cuentas_cobro WHERE id = ${id}::uuid LIMIT 1`;
    if (!current[0]) return jsonError("Cobro no encontrado", 404);
    const row = current[0];

    const rows = await sql`
      UPDATE cuentas_cobro
      SET
        cliente_id = ${body.clienteId ?? row.cliente_id}::uuid,
        fecha = ${body.fechaEmision ?? row.fecha},
        fecha_vencimiento = ${body.fechaVencimiento ?? row.fecha_vencimiento},
        status = ${body.status ?? row.status},
        notas = ${body.observaciones ?? row.notas},
        subtotal = ${body.subtotal ?? row.subtotal},
        iva = ${body.iva ?? row.iva},
        total = ${body.total ?? row.total},
        updated_at = now()
      WHERE id = ${id}::uuid
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

    return jsonOk({ item: rows[0] });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible actualizar cobro");
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = String(params.id ?? "");
    const sql = getSqlClient();

    await sql`DELETE FROM cuentas_cobro WHERE id = ${id}::uuid`;
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible eliminar cobro");
  }
};