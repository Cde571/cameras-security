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

function normalizeFirma(value: unknown) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v.startsWith("data:image/") ? v : null;
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const sql = getSqlClient();
    const q = String(url.searchParams.get("q") ?? "").trim().toLowerCase();

    const rows = q
      ? await sql`
          SELECT
            a.id::text AS id,
            a.numero,
            a.cliente_id::text AS "clienteId",
            json_build_object(
              'id', c.id::text,
              'nombre', c.nombre,
              'documento', c.documento,
              'telefono', c.telefono,
              'email', c.email,
              'ciudad', c.ciudad
            ) AS cliente,
            a.fecha::text AS fecha,
            a.lugar,
            coalesce(a.estado, 'borrador') AS status,
            a.estado,
            a.observaciones,
            a.firma_data_url AS "firmaDataUrl",
            a.created_at::text AS "createdAt",
            a.updated_at::text AS "updatedAt"
          FROM actas a
          LEFT JOIN clientes c ON c.id = a.cliente_id
          WHERE
            lower(coalesce(a.numero,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(c.nombre,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(a.lugar,'')) LIKE ${`%${q}%`}
          ORDER BY coalesce(a.updated_at, a.created_at, now()) DESC
        `
      : await sql`
          SELECT
            a.id::text AS id,
            a.numero,
            a.cliente_id::text AS "clienteId",
            json_build_object(
              'id', c.id::text,
              'nombre', c.nombre,
              'documento', c.documento,
              'telefono', c.telefono,
              'email', c.email,
              'ciudad', c.ciudad
            ) AS cliente,
            a.fecha::text AS fecha,
            a.lugar,
            coalesce(a.estado, 'borrador') AS status,
            a.estado,
            a.observaciones,
            a.firma_data_url AS "firmaDataUrl",
            a.created_at::text AS "createdAt",
            a.updated_at::text AS "updatedAt"
          FROM actas a
          LEFT JOIN clientes c ON c.id = a.cliente_id
          ORDER BY coalesce(a.updated_at, a.created_at, now()) DESC
        `;

    return json({ ok: true, items: rows });
  } catch (error: any) {
    console.error("[api/actas][GET]", error);
    return json({ ok: false, error: error?.message || "No fue posible listar actas" }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();

    const numero = String(body?.numero ?? "").trim() || `ACT-${Date.now()}`;
    const rawClienteId = typeof body?.clienteId === "string" ? body.clienteId.trim() : "";
    const clienteId = isUuid(rawClienteId) ? rawClienteId : null;
    const estado = String(body?.estado ?? body?.status ?? "borrador").trim() || "borrador";
    const firmaDataUrl = normalizeFirma(body?.firmaDataUrl);

    const rows = await sql`
      INSERT INTO actas (
        numero,
        cliente_id,
        fecha,
        lugar,
        estado,
        observaciones,
        firma_data_url
      ) VALUES (
        ${numero},
        ${clienteId}::uuid,
        ${body?.fecha ?? new Date().toISOString().slice(0, 10)},
        ${body?.lugar ?? null},
        ${estado},
        ${body?.observaciones ?? null},
        ${firmaDataUrl}
      )
      RETURNING
        id::text AS id,
        numero,
        cliente_id::text AS "clienteId",
        fecha::text AS fecha,
        lugar,
        coalesce(estado, 'borrador') AS status,
        estado,
        observaciones,
        firma_data_url AS "firmaDataUrl",
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return json({ ok: true, item: rows[0] }, 201);
  } catch (error: any) {
    console.error("[api/actas][POST]", error);
    return json({ ok: false, error: error?.message || "No fue posible crear acta" }, 500);
  }
};