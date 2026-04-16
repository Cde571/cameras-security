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

export const GET: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");

    const rows = await sql`
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
      WHERE a.id = ${id}::uuid
      LIMIT 1
    `;

    if (!rows[0]) {
      return json({ ok: false, error: "Acta no encontrada" }, 404);
    }

    return json({ ok: true, item: rows[0] });
  } catch (error: any) {
    console.error("[api/actas/:id][GET]", error);
    return json({ ok: false, error: error?.message || "No fue posible consultar acta" }, 500);
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");
    const body = await request.json();

    const current = await sql`SELECT * FROM actas WHERE id = ${id}::uuid LIMIT 1`;
    if (!current[0]) {
      return json({ ok: false, error: "Acta no encontrada" }, 404);
    }

    const row = current[0];
    const rawClienteId = typeof body?.clienteId === "string" ? body.clienteId.trim() : "";
    const clienteId = isUuid(rawClienteId) ? rawClienteId : row.cliente_id;
    const estado = String(body?.estado ?? body?.status ?? row.estado ?? "borrador").trim() || "borrador";
    const firmaDataUrl =
      body?.firmaDataUrl === ""
        ? null
        : (normalizeFirma(body?.firmaDataUrl) ?? row.firma_data_url ?? null);

    const rows = await sql`
      UPDATE actas
      SET
        numero = ${body?.numero ?? row.numero},
        cliente_id = ${clienteId}::uuid,
        fecha = ${body?.fecha ?? row.fecha},
        lugar = ${body?.lugar ?? row.lugar},
        estado = ${estado},
        observaciones = ${body?.observaciones ?? row.observaciones},
        firma_data_url = ${firmaDataUrl},
        updated_at = now()
      WHERE id = ${id}::uuid
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

    return json({ ok: true, item: rows[0] });
  } catch (error: any) {
    console.error("[api/actas/:id][PATCH]", error);
    return json({ ok: false, error: error?.message || "No fue posible actualizar acta" }, 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");

    await sql`DELETE FROM actas WHERE id = ${id}::uuid`;
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("[api/actas/:id][DELETE]", error);
    return json({ ok: false, error: error?.message || "No fue posible eliminar acta" }, 500);
  }
};