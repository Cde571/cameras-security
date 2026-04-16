import type { APIRoute } from "astro";
import { getSqlClient } from "../../../../lib/db/client";

export const GET: APIRoute = async ({ url }) => {
  try {
    const sql = getSqlClient();
    const q = String(url.searchParams.get("q") ?? "").trim().toLowerCase();

    const rows = q
      ? await sql`
          SELECT
            k.id::text AS id,
            k.nombre,
            k.codigo,
            k.descripcion,
            coalesce(k.costo_total, 0)::float AS "costoTotal",
            coalesce(k.precio_total, 0)::float AS "precioTotal",
            coalesce(k.precio, 0)::float AS precio,
            coalesce(k.descuento_pct, 0)::float AS "descuentoPct",
            coalesce(k.precio_fijo, 0)::float AS "precioFijo",
            coalesce(k.activo, true) AS activo,
            coalesce(k.estado, 'activo') AS estado,
            k.created_at::text AS "createdAt",
            k.updated_at::text AS "updatedAt"
          FROM kits k
          WHERE
            lower(coalesce(k.nombre,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(k.codigo,'')) LIKE ${`%${q}%`}
            OR lower(coalesce(k.descripcion,'')) LIKE ${`%${q}%`}
          ORDER BY coalesce(k.updated_at, k.created_at, now()) DESC
        `
      : await sql`
          SELECT
            k.id::text AS id,
            k.nombre,
            k.codigo,
            k.descripcion,
            coalesce(k.costo_total, 0)::float AS "costoTotal",
            coalesce(k.precio_total, 0)::float AS "precioTotal",
            coalesce(k.precio, 0)::float AS precio,
            coalesce(k.descuento_pct, 0)::float AS "descuentoPct",
            coalesce(k.precio_fijo, 0)::float AS "precioFijo",
            coalesce(k.activo, true) AS activo,
            coalesce(k.estado, 'activo') AS estado,
            k.created_at::text AS "createdAt",
            k.updated_at::text AS "updatedAt"
          FROM kits k
          ORDER BY coalesce(k.updated_at, k.created_at, now()) DESC
        `;

    return new Response(JSON.stringify({ ok: true, items: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error?.message || "No fue posible listar kits"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const sql = getSqlClient();
    const body = await request.json();

    if (!String(body?.nombre ?? "").trim()) {
      return new Response(JSON.stringify({
        ok: false,
        error: "El nombre es obligatorio"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const rows = await sql`
      INSERT INTO kits (
        nombre, codigo, descripcion, costo_total, precio_total, precio, descuento_pct, precio_fijo, activo, estado
      ) VALUES (
        ${String(body.nombre).trim()},
        ${body.codigo ?? null},
        ${body.descripcion ?? null},
        ${body.costoTotal ?? 0},
        ${body.precioTotal ?? 0},
        ${body.precio ?? 0},
        ${body.descuentoPct ?? 0},
        ${body.precioFijo ?? null},
        ${body.activo ?? true},
        ${body.estado ?? 'activo'}
      )
      RETURNING
        id::text AS id,
        nombre,
        codigo,
        descripcion,
        coalesce(costo_total, 0)::float AS "costoTotal",
        coalesce(precio_total, 0)::float AS "precioTotal",
        coalesce(precio, 0)::float AS precio,
        coalesce(descuento_pct, 0)::float AS "descuentoPct",
        coalesce(precio_fijo, 0)::float AS "precioFijo",
        coalesce(activo, true) AS activo,
        coalesce(estado, 'activo') AS estado,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return new Response(JSON.stringify({ ok: true, item: rows[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error?.message || "No fue posible crear kit"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};