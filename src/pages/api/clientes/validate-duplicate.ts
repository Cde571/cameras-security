import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

function normalize(value: any) {
  return String(value ?? "").trim().toLowerCase();
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const currentId = normalize(body?.id);
    const documento = normalize(body?.documento);
    const email = normalize(body?.email);
    const telefono = normalize(body?.telefono);

    if (!documento && !email && !telefono) {
      return new Response(JSON.stringify({ ok: true, duplicated: false, matches: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sql = getSqlClient();
    const rows = await sql`
      SELECT id::text, nombre, documento, email, telefono
      FROM clientes
      WHERE (
        (${documento} <> '' AND lower(coalesce(documento, '')) = ${documento})
        OR (${email} <> '' AND lower(coalesce(email, '')) = ${email})
        OR (${telefono} <> '' AND lower(coalesce(telefono, '')) = ${telefono})
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
    return new Response(JSON.stringify({ ok: false, duplicated: false, matches: [], error: error?.message || "No fue posible validar duplicados" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
