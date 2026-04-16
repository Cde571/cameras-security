import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function normalize(value: any) {
  return String(value ?? "").trim().toLowerCase();
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const currentId = normalize(body?.id);
    const codigo = normalize(body?.codigo);
    const sku = normalize(body?.sku);
    const nombre = normalize(body?.nombre);

    if (!codigo && !sku && !nombre) {
      return new Response(JSON.stringify({ ok: true, duplicated: false, matches: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sql = getSqlClient();
    const rows = await sql`
      SELECT id::text, nombre, codigo, sku
      FROM productos
      WHERE (
        (${codigo} <> '' AND lower(coalesce(codigo, '')) = ${codigo})
        OR (${sku} <> '' AND lower(coalesce(sku, '')) = ${sku})
        OR (${nombre} <> '' AND lower(coalesce(nombre, '')) = ${nombre})
      )
    `;

    const matches = rows.filter((row: any) => String(row.id).toLowerCase() !== currentId);

    return new Response(JSON.stringify({
      ok: true,
      duplicated: matches.length > 0,
      matches,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, duplicated: false, matches: [], error: error?.message || "No fue posible validar duplicados de productos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
