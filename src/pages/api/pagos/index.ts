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

function toMoney(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const sql = getSqlClient();
    const q = String(url.searchParams.get("q") ?? "").trim().toLowerCase();

    const rows = q
      ? await sql`
          SELECT
            p.id::text AS id,
            p.cuenta_cobro_id::text AS "cuentaCobroId",
            p.cliente_id::text AS "clienteId",
            p.fecha::text AS fecha,
            p.metodo,
            p.referencia,
            p.valor,
            p.notas,
            p.created_at::text AS "createdAt",
            p.updated_at::text AS "updatedAt",
            json_build_object(
              'id', c.id::text,
              'nombre', c.nombre,
              'documento', c.documento,
              'telefono', c.telefono,
              'email', c.email,
              'ciudad', c.ciudad
            ) AS cliente,
            json_build_object(
              'id', cc.id::text,
              'numero', cc.numero,
              'status', cc.status,
              'total', cc.total
            ) AS cuenta
          FROM pagos p
          LEFT JOIN clientes c ON c.id = p.cliente_id
          LEFT JOIN cuentas_cobro cc ON cc.id = p.cuenta_cobro_id
          WHERE
            lower(coalesce(c.nombre,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(cc.numero,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(p.metodo,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(p.referencia,'')) LIKE ${`%${q}%`}
          ORDER BY coalesce(p.fecha, current_date) DESC, p.created_at DESC
        `
      : await sql`
          SELECT
            p.id::text AS id,
            p.cuenta_cobro_id::text AS "cuentaCobroId",
            p.cliente_id::text AS "clienteId",
            p.fecha::text AS fecha,
            p.metodo,
            p.referencia,
            p.valor,
            p.notas,
            p.created_at::text AS "createdAt",
            p.updated_at::text AS "updatedAt",
            json_build_object(
              'id', c.id::text,
              'nombre', c.nombre,
              'documento', c.documento,
              'telefono', c.telefono,
              'email', c.email,
              'ciudad', c.ciudad
            ) AS cliente,
            json_build_object(
              'id', cc.id::text,
              'numero', cc.numero,
              'status', cc.status,
              'total', cc.total
            ) AS cuenta
          FROM pagos p
          LEFT JOIN clientes c ON c.id = p.cliente_id
          LEFT JOIN cuentas_cobro cc ON cc.id = p.cuenta_cobro_id
          ORDER BY coalesce(p.fecha, current_date) DESC, p.created_at DESC
        `;

    return json({ ok: true, items: rows });
  } catch (error: any) {
    console.error("[api/pagos][GET]", error);
    return json({ ok: false, error: error?.message || "No fue posible listar pagos" }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();

    const cuentaCobroId =
      typeof body?.cuentaCobroId === "string" && isUuid(body.cuentaCobroId)
        ? body.cuentaCobroId.trim()
        : null;

    const clienteId =
      typeof body?.clienteId === "string" && isUuid(body.clienteId)
        ? body.clienteId.trim()
        : null;

    const fecha = String(body?.fecha ?? new Date().toISOString().slice(0, 10));
    const metodo = String(body?.metodo ?? "transferencia").trim() || "transferencia";
    const referencia = body?.referencia ? String(body.referencia) : null;
    const valor = toMoney(body?.valor);
    const notas = body?.notas ? String(body.notas) : null;

    const rows = await sql`
      INSERT INTO pagos (
        cuenta_cobro_id,
        cliente_id,
        fecha,
        metodo,
        referencia,
        valor,
        notas
      ) VALUES (
        ${cuentaCobroId}::uuid,
        ${clienteId}::uuid,
        ${fecha},
        ${metodo},
        ${referencia},
        ${valor},
        ${notas}
      )
      RETURNING
        id::text AS id,
        cuenta_cobro_id::text AS "cuentaCobroId",
        cliente_id::text AS "clienteId",
        fecha::text AS fecha,
        metodo,
        referencia,
        valor,
        notas,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return json({ ok: true, item: rows[0] }, 201);
  } catch (error: any) {
    console.error("[api/pagos][POST]", error);
    return json({ ok: false, error: error?.message || "No fue posible crear el pago" }, 500);
  }
};