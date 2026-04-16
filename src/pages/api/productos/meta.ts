import type { APIRoute } from "astro";
import { getSqlClient } from "../../../lib/db/client";

export const GET: APIRoute = async () => {
  try {
    const sql = getSqlClient();

    const categoriasRows = await sql`
      SELECT DISTINCT categoria
      FROM productos
      WHERE categoria IS NOT NULL AND trim(categoria) <> ''
      ORDER BY categoria ASC
    `;

    const marcasRows = await sql`
      SELECT DISTINCT marca
      FROM productos
      WHERE marca IS NOT NULL AND trim(marca) <> ''
      ORDER BY marca ASC
    `;

    const resumen = await sql`
      SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE coalesce(activo, true) = true)::int AS activos,
        count(*) FILTER (WHERE coalesce(activo, true) = false OR coalesce(estado,'activo') = 'inactivo')::int AS inactivos
      FROM productos
    `;

    return new Response(JSON.stringify({
      ok: true,
      item: {
        categorias: categoriasRows.map((x: any) => x.categoria).filter(Boolean),
        marcas: marcasRows.map((x: any) => x.marca).filter(Boolean),
        total: resumen?.[0]?.total ?? 0,
        activos: resumen?.[0]?.activos ?? 0,
        inactivos: resumen?.[0]?.inactivos ?? 0,
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error?.message || "No fue posible cargar metadatos de productos"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};