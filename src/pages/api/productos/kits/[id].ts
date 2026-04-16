import type { APIRoute } from "astro";
import { getSqlClient } from "../../../../lib/db/client";

export const GET: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");

    const rows = await sql`
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
      WHERE k.id = ${id}::uuid
      LIMIT 1
    `;

    if (!rows[0]) {
      return new Response(JSON.stringify({
        ok: false,
        error: "Kit no encontrado"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true, item: rows[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error?.message || "No fue posible consultar kit"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");
    const body = await request.json();

    const current = await sql`SELECT * FROM kits WHERE id = ${id}::uuid LIMIT 1`;
    if (!current[0]) {
      return new Response(JSON.stringify({
        ok: false,
        error: "Kit no encontrado"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const row = current[0];

    const rows = await sql`
      UPDATE kits
      SET
        nombre = ${body.nombre ?? row.nombre},
        codigo = ${body.codigo ?? row.codigo},
        descripcion = ${body.descripcion ?? row.descripcion},
        costo_total = ${body.costoTotal ?? row.costo_total},
        precio_total = ${body.precioTotal ?? row.precio_total},
        precio = ${body.precio ?? row.precio},
        descuento_pct = ${body.descuentoPct ?? row.descuento_pct},
        precio_fijo = ${body.precioFijo ?? row.precio_fijo},
        activo = ${body.activo ?? row.activo},
        estado = ${body.estado ?? row.estado},
        updated_at = now()
      WHERE id = ${id}::uuid
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
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error?.message || "No fue posible actualizar kit"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const sql = getSqlClient();
    const id = String(params.id ?? "");
    await sql`DELETE FROM kits WHERE id = ${id}::uuid`;

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error?.message || "No fue posible eliminar kit"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};