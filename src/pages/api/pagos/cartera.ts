import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  try {
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
          'ciudad', c.ciudad
        ) AS cliente,
        cc.fecha_emision::text AS "fechaEmision",
        cc.fecha_vencimiento::text AS "fechaVencimiento",
        cc.status,
        cc.total,
        COALESCE(SUM(p.valor), 0) AS pagado,
        (cc.total - COALESCE(SUM(p.valor), 0)) AS saldo
      FROM cuentas_cobro cc
      LEFT JOIN clientes c ON c.id = cc.cliente_id
      LEFT JOIN pagos p ON p.cuenta_cobro_id = cc.id
      GROUP BY
        cc.id, cc.numero, cc.cliente_id, c.id, c.nombre, c.documento, c.telefono, c.email, c.ciudad,
        cc.fecha_emision, cc.fecha_vencimiento, cc.status, cc.total
      ORDER BY cc.fecha_emision DESC, cc.created_at DESC
    `;

    return json({ ok: true, items: rows });
  } catch (error: any) {
    console.error("[api/pagos/cartera][GET]", error);
    return json({ ok: false, error: error?.message || "No fue posible obtener la cartera" }, 500);
  }
};