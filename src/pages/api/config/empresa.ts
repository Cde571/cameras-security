import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getEmpresaRow(sql: any) {
  const rows = await sql`
    SELECT
      id::text AS id,
      nombre,
      nit,
      email,
      telefono,
      direccion,
      ciudad,
      website,
      logo_url AS "logoUrl",
      resolucion,
      prefijo_cotizacion AS "prefijoCotizacion",
      prefijo_orden AS "prefijoOrden",
      prefijo_acta AS "prefijoActa",
      prefijo_cobro AS "prefijoCobro",
      moneda,
      timezone,
      created_at::text AS "createdAt",
      updated_at::text AS "updatedAt"
    FROM empresa_config
    ORDER BY created_at ASC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();
    const row = await getEmpresaRow(sql);

    if (!row) {
      return json({ ok: false, error: "No existe configuración de empresa" }, 404);
    }

    return json({ ok: true, item: row }, 200);
  } catch (error: any) {
    console.error("[api/config/empresa][GET]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible cargar la configuración de empresa",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();

    const current = await getEmpresaRow(sql);
    if (!current) {
      return json({ ok: false, error: "No existe configuración de empresa" }, 404);
    }

    const rows = await sql`
      UPDATE empresa_config
      SET
        nombre = ${String(body?.nombre ?? current.nombre ?? "")},
        nit = ${String(body?.nit ?? current.nit ?? "")},
        email = ${String(body?.email ?? current.email ?? "")},
        telefono = ${String(body?.telefono ?? current.telefono ?? "")},
        direccion = ${String(body?.direccion ?? current.direccion ?? "")},
        ciudad = ${String(body?.ciudad ?? current.ciudad ?? "")},
        website = ${String(body?.website ?? current.website ?? "")},
        logo_url = ${String(body?.logoUrl ?? current.logoUrl ?? "")},
        resolucion = ${String(body?.resolucion ?? current.resolucion ?? "")},
        prefijo_cotizacion = ${String(body?.prefijoCotizacion ?? current.prefijoCotizacion ?? "COT")},
        prefijo_orden = ${String(body?.prefijoOrden ?? current.prefijoOrden ?? "OT")},
        prefijo_acta = ${String(body?.prefijoActa ?? current.prefijoActa ?? "ACT")},
        prefijo_cobro = ${String(body?.prefijoCobro ?? current.prefijoCobro ?? "CC")},
        moneda = ${String(body?.moneda ?? current.moneda ?? "COP")},
        timezone = ${String(body?.timezone ?? current.timezone ?? "America/Bogota")},
        updated_at = now()
      WHERE id = ${current.id}::uuid
      RETURNING
        id::text AS id,
        nombre,
        nit,
        email,
        telefono,
        direccion,
        ciudad,
        website,
        logo_url AS "logoUrl",
        resolucion,
        prefijo_cotizacion AS "prefijoCotizacion",
        prefijo_orden AS "prefijoOrden",
        prefijo_acta AS "prefijoActa",
        prefijo_cobro AS "prefijoCobro",
        moneda,
        timezone,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return json({ ok: true, item: rows[0] }, 200);
  } catch (error: any) {
    console.error("[api/config/empresa][PATCH]", error);
    return json({
      ok: false,
      error: error?.message || "No fue posible guardar la configuración de empresa",
      code: error?.code || null,
      detail: error?.detail || null,
    }, 500);
  }
};