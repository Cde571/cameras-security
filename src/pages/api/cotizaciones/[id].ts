import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isUuid(value: unknown) {
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");

    const rows = await sql`
      SELECT
        c.id::text AS id,
        c.numero,
        c.version,
        c.fecha::text AS fecha,
        c.vigencia_dias AS "vigenciaDias",
        c.status,
        c.cliente_id::text AS "clienteId",
        cl.nombre AS "clienteNombre",
        c.asunto,
        c.condiciones,
        c.notas,
        coalesce(c.subtotal, 0)::float AS subtotal,
        coalesce(c.iva, 0)::float AS iva,
        coalesce(c.total, 0)::float AS total,
        c.created_at::text AS "createdAt",
        c.updated_at::text AS "updatedAt"
      FROM cotizaciones c
      LEFT JOIN clientes cl ON cl.id = c.cliente_id
      WHERE c.id = ${id}::uuid
      LIMIT 1
    `;

    if (!rows[0]) {
      return json({ ok: false, error: "Cotización no encontrada" }, 404);
    }

    return json({ ok: true, item: rows[0] });
  } catch (error: any) {
    console.error("[api/cotizaciones/:id][GET]", error);
    return json({ ok: false, error: error?.message || "No fue posible consultar cotización" }, 500);
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");
    const body = await request.json();

    const current = await sql`SELECT * FROM cotizaciones WHERE id = ${id}::uuid LIMIT 1`;
    if (!current[0]) {
      return json({ ok: false, error: "Cotización no encontrada" }, 404);
    }

    const row = current[0];
    const rawClienteId = typeof body?.clienteId === "string" ? body.clienteId.trim() : "";
    const clienteId =
      isUuid(rawClienteId)
        ? rawClienteId
        : row.cliente_id;

    const rows = await sql`
      UPDATE cotizaciones
      SET
        numero = ${body?.numero ?? row.numero},
        version = ${Number(body?.version ?? row.version)},
        fecha = ${body?.fecha ?? row.fecha},
        vigencia_dias = ${Number(body?.vigenciaDias ?? row.vigencia_dias)},
        cliente_id = ${clienteId}::uuid,
        asunto = ${body?.asunto ?? row.asunto},
        condiciones = ${body?.condiciones ?? row.condiciones},
        notas = ${body?.notas ?? row.notas},
        subtotal = ${Number(body?.subtotal ?? row.subtotal ?? 0)},
        iva = ${Number(body?.iva ?? row.iva ?? 0)},
        total = ${Number(body?.total ?? row.total ?? 0)},
        status = ${body?.status ?? row.status},
        updated_at = now()
      WHERE id = ${id}::uuid
      RETURNING
        id::text AS id,
        numero,
        version,
        fecha::text AS fecha,
        vigencia_dias AS "vigenciaDias",
        status,
        cliente_id::text AS "clienteId",
        asunto,
        condiciones,
        notas,
        coalesce(subtotal, 0)::float AS subtotal,
        coalesce(iva, 0)::float AS iva,
        coalesce(total, 0)::float AS total,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return json({ ok: true, item: rows[0] });
  } catch (error: any) {
    console.error("[api/cotizaciones/:id][PATCH]", error);
    return json({ ok: false, error: error?.message || "No fue posible actualizar cotización" }, 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");

    await sql`DELETE FROM cotizaciones WHERE id = ${id}::uuid`;
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("[api/cotizaciones/:id][DELETE]", error);
    return json({ ok: false, error: error?.message || "No fue posible eliminar cotización" }, 500);
  }
};