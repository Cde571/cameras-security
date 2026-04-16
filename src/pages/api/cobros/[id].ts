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

async function fetchCuenta(sql: any, id: string) {
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
      cc.updated_at::text AS "updatedAt",
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', i.id::text,
              'descripcion', i.descripcion,
              'cantidad', i.cantidad,
              'valorUnitario', i.valor_unitario,
              'subtotal', i.subtotal
            )
            ORDER BY i.created_at ASC
          )
          FROM cuenta_cobro_items i
          WHERE i.cuenta_cobro_id = cc.id
        ),
        '[]'::json
      ) AS items
    FROM cuentas_cobro cc
    LEFT JOIN clientes c ON c.id = cc.cliente_id
    WHERE cc.id = ${id}::uuid
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");
    const row = await fetchCuenta(sql, id);

    if (!row) {
      return json({ ok: false, error: "Cuenta de cobro no encontrada" }, 404);
    }

    return json({ ok: true, item: row }, 200);
  } catch (error: any) {
    console.error("[api/cobros/:id][GET]", error);
    return json(
      { ok: false, error: error?.message || "No fue posible consultar la cuenta de cobro" },
      500
    );
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");
    const body = await request.json();

    const current = await fetchCuenta(sql, id);
    if (!current) {
      return json({ ok: false, error: "Cuenta de cobro no encontrada" }, 404);
    }

    const rawClienteId = typeof body?.clienteId === "string" ? body.clienteId.trim() : "";
    const clienteId = isUuid(rawClienteId) ? rawClienteId : current.clienteId;
    const fechaEmision = String(
      body?.fechaEmision ?? current.fechaEmision ?? new Date().toISOString().slice(0, 10)
    );
    const fechaVencimiento = body?.fechaVencimiento ?? current.fechaVencimiento ?? null;
    const status = String(body?.status ?? current.status ?? "pendiente").trim() || "pendiente";
    const observaciones = body?.observaciones ?? current.observaciones ?? null;
    const numero = String(body?.numero ?? current.numero ?? "").trim() || current.numero;
    const items = Array.isArray(body?.items) ? body.items : current.items;

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

    await sql.begin(async (tx) => {
      await tx`
        UPDATE cuentas_cobro
        SET
          numero = ${numero},
          cliente_id = ${clienteId}::uuid,
          fecha_emision = ${fechaEmision},
          fecha_vencimiento = ${fechaVencimiento},
          status = ${status},
          subtotal = ${subtotal},
          iva = ${iva},
          total = ${total},
          observaciones = ${observaciones},
          updated_at = now()
        WHERE id = ${id}::uuid
      `;

      await tx`DELETE FROM cuenta_cobro_items WHERE cuenta_cobro_id = ${id}::uuid`;

      for (const item of validItems) {
        await tx`
          INSERT INTO cuenta_cobro_items (
            cuenta_cobro_id,
            descripcion,
            cantidad,
            valor_unitario,
            subtotal
          )
          VALUES (
            ${id}::uuid,
            ${item.descripcion},
            ${item.cantidad},
            ${item.valorUnitario},
            ${item.subtotal}
          )
        `;
      }
    });

    const updated = await fetchCuenta(sql, id);
    return json({ ok: true, item: updated }, 200);
  } catch (error: any) {
    console.error("[api/cobros/:id][PATCH]", error);
    return json(
      { ok: false, error: error?.message || "No fue posible actualizar la cuenta de cobro" },
      500
    );
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");

    await sql.begin(async (tx) => {
      await tx`DELETE FROM cuenta_cobro_items WHERE cuenta_cobro_id = ${id}::uuid`;
      await tx`DELETE FROM cuentas_cobro WHERE id = ${id}::uuid`;
    });

    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("[api/cobros/:id][DELETE]", error);
    return json(
      { ok: false, error: error?.message || "No fue posible eliminar la cuenta de cobro" },
      500
    );
  }
};