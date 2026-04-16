import type { APIRoute } from "astro";
import { getSqlClient } from "../../../../lib/db/client";

export const GET: APIRoute = async ({ url }) => {
  try {
    const q = String(url.searchParams.get("q") ?? "").trim().toLowerCase();
    const sql = getSqlClient();

    const kits = q
      ? await sql`
          SELECT
            k.id::text,
            k.nombre,
            k.codigo,
            k.descripcion,
            coalesce(k.activo, true) AS activo,
            coalesce(k.costo_total, 0)::float AS "costoTotal",
            coalesce(k.precio_total, 0)::float AS "precioTotal",
            k.created_at::text AS "createdAt",
            k.updated_at::text AS "updatedAt"
          FROM kits k
          WHERE
            lower(coalesce(k.nombre, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(k.codigo, '')) LIKE ${`%${q}%`}
            OR lower(coalesce(k.descripcion, '')) LIKE ${`%${q}%`}
          ORDER BY coalesce(k.updated_at, k.created_at, now()) DESC
        `
      : await sql`
          SELECT
            k.id::text,
            k.nombre,
            k.codigo,
            k.descripcion,
            coalesce(k.activo, true) AS activo,
            coalesce(k.costo_total, 0)::float AS "costoTotal",
            coalesce(k.precio_total, 0)::float AS "precioTotal",
            k.created_at::text AS "createdAt",
            k.updated_at::text AS "updatedAt"
          FROM kits k
          ORDER BY coalesce(k.updated_at, k.created_at, now()) DESC
        `;

    const items = [];
    for (const kit of kits as any[]) {
      const rows = await sql`
        SELECT
          ki.id::text,
          coalesce(ki.producto_id::text, '') AS "productoId",
          ki.nombre,
          coalesce(ki.cantidad, 1)::float AS cantidad,
          coalesce(ki.costo_unitario, 0)::float AS "costoUnitario",
          coalesce(ki.precio_unitario, 0)::float AS "precioUnitario"
        FROM kit_items ki
        WHERE ki.kit_id = ${kit.id}::uuid
        ORDER BY ki.created_at ASC
      `;

      items.push({
        ...kit,
        items: rows,
      });
    }

    return new Response(JSON.stringify({ ok: true, items }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, items: [], error: error?.message || "No fue posible listar kits" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const sql = getSqlClient();

  try {
    const body = await request.json();
    const insertedKit = await sql.begin(async (tx) => {
      const kitRows = await tx`
        INSERT INTO kits (nombre, codigo, descripcion, activo, costo_total, precio_total)
        VALUES (
          ${body.nombre},
          ${body.codigo},
          ${body.descripcion},
          ${body.activo ?? true},
          ${body.costoTotal ?? 0},
          ${body.precioTotal ?? 0}
        )
        RETURNING id::text
      `;

      const kitId = String(kitRows[0].id);
      const items = Array.isArray(body.items) ? body.items : [];

      for (const item of items) {
        await tx`
          INSERT INTO kit_items (
            kit_id, producto_id, nombre, cantidad, costo_unitario, precio_unitario
          )
          VALUES (
            ${kitId}::uuid,
            ${item.productoId ? `${item.productoId}` : null},
            ${item.nombre},
            ${item.cantidad ?? 1},
            ${item.costoUnitario ?? 0},
            ${item.precioUnitario ?? 0}
          )
        `;
      }

      const full = await tx`
        SELECT
          k.id::text,
          k.nombre,
          k.codigo,
          k.descripcion,
          coalesce(k.activo, true) AS activo,
          coalesce(k.costo_total, 0)::float AS "costoTotal",
          coalesce(k.precio_total, 0)::float AS "precioTotal",
          k.created_at::text AS "createdAt",
          k.updated_at::text AS "updatedAt"
        FROM kits k
        WHERE k.id = ${kitId}::uuid
        LIMIT 1
      `;

      const rows = await tx`
        SELECT
          ki.id::text,
          coalesce(ki.producto_id::text, '') AS "productoId",
          ki.nombre,
          coalesce(ki.cantidad, 1)::float AS cantidad,
          coalesce(ki.costo_unitario, 0)::float AS "costoUnitario",
          coalesce(ki.precio_unitario, 0)::float AS "precioUnitario"
        FROM kit_items ki
        WHERE ki.kit_id = ${kitId}::uuid
        ORDER BY ki.created_at ASC
      `;

      return { ...full[0], items: rows };
    });

    return new Response(JSON.stringify({ ok: true, item: insertedKit }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, error: error?.message || "No fue posible crear kit" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
