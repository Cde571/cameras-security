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

export const GET: APIRoute = async ({ url }) => {
  try {
    const sql = getSqlClient();
    const q = String(url.searchParams.get("q") ?? "").trim().toLowerCase();

    const rows = q
      ? await sql`
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
          WHERE
            lower(coalesce(c.numero, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(cl.nombre, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(c.asunto, '')) LIKE ${`%${q}%`}
          ORDER BY coalesce(c.updated_at, c.created_at, now()) DESC
        `
      : await sql`
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
          ORDER BY coalesce(c.updated_at, c.created_at, now()) DESC
        `;

    return json({ ok: true, items: rows });
  } catch (error: any) {
    console.error("[api/cotizaciones][GET]", error);
    return json({ ok: false, error: error?.message || "No fue posible listar cotizaciones" }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();

    const numero = String(body?.numero ?? "").trim() || `COT-${Date.now()}`;
    const rawClienteId = typeof body?.clienteId === "string" ? body.clienteId.trim() : "";
    const clienteId = isUuid(rawClienteId) ? rawClienteId : null;

    const rows = await sql`
      INSERT INTO cotizaciones (
        numero,
        version,
        fecha,
        vigencia_dias,
        cliente_id,
        asunto,
        condiciones,
        notas,
        subtotal,
        iva,
        total,
        status
      ) VALUES (
        ${numero},
        ${Number(body?.version ?? 1)},
        ${body?.fecha ?? new Date().toISOString().slice(0, 10)},
        ${Number(body?.vigenciaDias ?? 30)},
        ${clienteId}::uuid,
        ${body?.asunto ?? null},
        ${body?.condiciones ?? null},
        ${body?.notas ?? null},
        ${Number(body?.subtotal ?? 0)},
        ${Number(body?.iva ?? 0)},
        ${Number(body?.total ?? 0)},
        ${body?.status ?? "borrador"}
      )
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

    return json({
      ok: true,
      item: rows[0],
      warning: clienteId ? null : "clienteId inválido o vacío; se guardó sin cliente asociado"
    }, 201);
  } catch (error: any) {
    console.error("[api/cotizaciones][POST]", error);
    return json({ ok: false, error: error?.message || "No fue posible crear cotización" }, 500);
  }
};