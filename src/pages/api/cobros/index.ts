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
            cc.id::text AS id,
            cc.numero,
            cc.cliente_id::text AS "clienteId",
            json_build_object(
              'id', c.id::text,
              'nombre', c.nombre,
              'documento', c.documento,
              'telefono', c.telefono,
              'email', c.email,
              'ciudad', c.ciudad
            ) AS cliente,
            cc.fecha_emision::text AS "fechaEmision",
            cc.fecha_vencimiento::text AS "fechaVencimiento",
            cc.status,
            cc.subtotal,
            cc.iva,
            cc.total,
            cc.observaciones,
            cc.created_at::text AS "createdAt",
            cc.updated_at::text AS "updatedAt"
          FROM cuentas_cobro cc
          LEFT JOIN clientes c ON c.id = cc.cliente_id
          WHERE
            lower(coalesce(cc.numero,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(c.nombre,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(cc.observaciones,'')) LIKE ${`%${q}%`}
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
              'ciudad', c.ciudad
            ) AS cliente,
            cc.fecha_emision::text AS "fechaEmision",
            cc.fecha_vencimiento::text AS "fechaVencimiento",
            cc.status,
            cc.subtotal,
            cc.iva,
            cc.total,
            cc.observaciones,
            cc.created_at::text AS "createdAt",
            cc.updated_at::text AS "updatedAt"
          FROM cuentas_cobro cc
          LEFT JOIN clientes c ON c.id = cc.cliente_id
          ORDER BY coalesce(cc.updated_at, cc.created_at, now()) DESC
        `;

    return json({ ok: true, items: rows });
  } catch (error: any) {
    console.error("[api/cobros][GET]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible listar cuentas de cobro",
      code: error?.code || null,
      detail: error?.detail || null
    }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();

    const numero = String(body?.numero ?? "").trim() || `CC-${Date.now()}`;
    const rawClienteId = typeof body?.clienteId === "string" ? body.clienteId.trim() : "";
    const clienteId = isUuid(rawClienteId) ? rawClienteId : null;
    const fechaEmision = String(body?.fechaEmision ?? new Date().toISOString().slice(0, 10));
    const fechaVencimiento = body?.fechaVencimiento ? String(body.fechaVencimiento) : null;
    const status = String(body?.status ?? "pendiente").trim() || "pendiente";
    const observaciones = body?.observaciones ? String(body.observaciones) : null;

    const items = Array.isArray(body?.items) ? body.items : [];
    const validItems = items
      .map((item: any) => {
        const cantidad = toMoney(item?.cantidad || 1);
        const valorUnitario = toMoney(item?.valorUnitario || 0);
        return {
          descripcion: String(item?.descripcion ?? "").trim(),
          cantidad,
          valorUnitario,
          subtotal: cantidad * valorUnitario,
        };
      })
      .filter((item: any) => item.descripcion.length > 0);

    const subtotal = validItems.reduce((acc: number, item: any) => acc + item.subtotal, 0);
    const iva = 0;
    const total = subtotal + iva;

    const inserted = await sql.begin(async (tx) => {
      const rows = await tx`
        INSERT INTO cuentas_cobro (
          numero, cliente_id, fecha_emision, fecha_vencimiento, status, subtotal, iva, total, observaciones
        ) VALUES (
          ${numero},
          ${clienteId}::uuid,
          ${fechaEmision},
          ${fechaVencimiento},
          ${status},
          ${subtotal},
          ${iva},
          ${total},
          ${observaciones}
        )
        RETURNING
          id::text AS id,
          numero,
          cliente_id::text AS "clienteId",
          fecha_emision::text AS "fechaEmision",
          fecha_vencimiento::text AS "fechaVencimiento",
          status,
          subtotal,
          iva,
          total,
          observaciones,
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
      `;

      const cuenta = rows[0];

      for (const item of validItems) {
        await tx`
          INSERT INTO cuenta_cobro_items (
            cuenta_cobro_id, descripcion, cantidad, valor_unitario, subtotal
          ) VALUES (
            ${cuenta.id}::uuid,
            ${item.descripcion},
            ${item.cantidad},
            ${item.valorUnitario},
            ${item.subtotal}
          )
        `;
      }

      return cuenta;
    });

    return json({ ok: true, item: inserted }, 201);
  } catch (error: any) {
    console.error("[api/cobros][POST]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible crear la cuenta de cobro",
      code: error?.code || null,
      detail: error?.detail || null
    }, 500);
  }
};