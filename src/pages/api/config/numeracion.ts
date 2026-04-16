import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function toInt(value: any, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : fallback;
}

async function getNumeracionRow(sql: any) {
  const rows = await sql`
    SELECT
      id::text AS id,
      prefijo_cotizacion AS "prefijoCotizacion",
      siguiente_cotizacion AS "siguienteCotizacion",
      padding_cotizacion AS "paddingCotizacion",
      prefijo_orden AS "prefijoOrden",
      siguiente_orden AS "siguienteOrden",
      padding_orden AS "paddingOrden",
      prefijo_acta AS "prefijoActa",
      siguiente_acta AS "siguienteActa",
      padding_acta AS "paddingActa",
      prefijo_cobro AS "prefijoCobro",
      siguiente_cobro AS "siguienteCobro",
      padding_cobro AS "paddingCobro",
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM numeracion_config
    ORDER BY created_at ASC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();
    const row = await getNumeracionRow(sql);

    if (!row) {
      return json({ ok: false, error: "No existe configuración de numeración" }, 404);
    }

    return json({ ok: true, item: row }, 200);
  } catch (error: any) {
    console.error("[api/config/numeracion][GET]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible cargar la configuración de numeración",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();

    const current = await getNumeracionRow(sql);
    if (!current) {
      return json({ ok: false, error: "No existe configuración de numeración" }, 404);
    }

    const rows = await sql`
      UPDATE numeracion_config
      SET
        prefijo_cotizacion = ${String(body?.prefijoCotizacion ?? current.prefijoCotizacion ?? "COT")},
        siguiente_cotizacion = ${toInt(body?.siguienteCotizacion, current.siguienteCotizacion ?? 1)},
        padding_cotizacion = ${toInt(body?.paddingCotizacion, current.paddingCotizacion ?? 4)},

        prefijo_orden = ${String(body?.prefijoOrden ?? current.prefijoOrden ?? "OT")},
        siguiente_orden = ${toInt(body?.siguienteOrden, current.siguienteOrden ?? 1)},
        padding_orden = ${toInt(body?.paddingOrden, current.paddingOrden ?? 4)},

        prefijo_acta = ${String(body?.prefijoActa ?? current.prefijoActa ?? "ACT")},
        siguiente_acta = ${toInt(body?.siguienteActa, current.siguienteActa ?? 1)},
        padding_acta = ${toInt(body?.paddingActa, current.paddingActa ?? 4)},

        prefijo_cobro = ${String(body?.prefijoCobro ?? current.prefijoCobro ?? "CC")},
        siguiente_cobro = ${toInt(body?.siguienteCobro, current.siguienteCobro ?? 1)},
        padding_cobro = ${toInt(body?.paddingCobro, current.paddingCobro ?? 4)},

        updated_at = now()
      WHERE id = ${current.id}::uuid
      RETURNING
        id::text AS id,
        prefijo_cotizacion AS "prefijoCotizacion",
        siguiente_cotizacion AS "siguienteCotizacion",
        padding_cotizacion AS "paddingCotizacion",
        prefijo_orden AS "prefijoOrden",
        siguiente_orden AS "siguienteOrden",
        padding_orden AS "paddingOrden",
        prefijo_acta AS "prefijoActa",
        siguiente_acta AS "siguienteActa",
        padding_acta AS "paddingActa",
        prefijo_cobro AS "prefijoCobro",
        siguiente_cobro AS "siguienteCobro",
        padding_cobro AS "paddingCobro",
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return json({ ok: true, item: rows[0] }, 200);
  } catch (error: any) {
    console.error("[api/config/numeracion][PATCH]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible guardar la configuración de numeración",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};