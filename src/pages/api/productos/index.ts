import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

export const GET: APIRoute = async ({ url }) => {
  try {
    const q = String(url.searchParams.get("q") ?? "").trim().toLowerCase();
    const sql = getSqlClient();

    const rows = q
      ? await sql`
          SELECT
            id::text,
            nombre,
            codigo,
            sku,
            descripcion,
            categoria,
            unidad,
            coalesce(costo, 0)::float AS costo,
            coalesce(precio, 0)::float AS precio,
            coalesce(iva, 0)::float AS iva,
            coalesce(stock, 0)::float AS stock,
            coalesce(activo, true) AS activo,
            created_at::text AS "createdAt",
            updated_at::text AS "updatedAt"
          FROM productos
          WHERE
            lower(coalesce(nombre, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(codigo, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(sku, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(descripcion, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(categoria, '')) LIKE ${`%${q}%`}
          ORDER BY coalesce(updated_at, created_at, now()) DESC
        `
      : await sql`
          SELECT
            id::text,
            nombre,
            codigo,
            sku,
            descripcion,
            categoria,
            unidad,
            coalesce(costo, 0)::float AS costo,
            coalesce(precio, 0)::float AS precio,
            coalesce(iva, 0)::float AS iva,
            coalesce(stock, 0)::float AS stock,
            coalesce(activo, true) AS activo,
            created_at::text AS "createdAt",
            updated_at::text AS "updatedAt"
          FROM productos
          ORDER BY coalesce(updated_at, created_at, now()) DESC
        `;

    return new Response(JSON.stringify({ ok: true, items: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, items: [], error: error?.message || "No fue posible listar productos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const sql = getSqlClient();

    const rows = await sql`
      INSERT INTO productos (
        nombre, codigo, sku, descripcion, categoria, unidad,
        costo, precio, iva, stock, activo
      )
      VALUES (
        ${body.nombre},
        ${body.codigo},
        ${body.sku},
        ${body.descripcion},
        ${body.categoria},
        ${body.unidad},
        ${body.costo ?? 0},
        ${body.precio ?? 0},
        ${body.iva ?? 0},
        ${body.stock ?? 0},
        ${body.activo ?? true}
      )
      RETURNING
        id::text,
        nombre,
        codigo,
        sku,
        descripcion,
        categoria,
        unidad,
        coalesce(costo, 0)::float AS costo,
        coalesce(precio, 0)::float AS precio,
        coalesce(iva, 0)::float AS iva,
        coalesce(stock, 0)::float AS stock,
        coalesce(activo, true) AS activo,
        created_at::text AS "createdAt",
        updated_at::text AS "updatedAt"
    `;

    return new Response(JSON.stringify({ ok: true, item: rows[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, error: error?.message || "No fue posible crear producto" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
