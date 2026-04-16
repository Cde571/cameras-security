import type { APIRoute } from "astro";
import {
  listOrdenesDb,
  createOrdenDb,
} from "../../../lib/server/api/dbModels";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const q = String(url.searchParams.get("q") ?? "");
    const rows = await listOrdenesDb(q);
    return json(rows, 200);
  } catch (error: any) {
    console.error("[api/ordenes][GET]", error);
    return json({ error: error?.message || "No fue posible listar órdenes" }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const created = await createOrdenDb(body);
    return json(created, 201);
  } catch (error: any) {
    console.error("[api/ordenes][POST]", error);
    return json({ error: error?.message || "No fue posible crear la orden" }, 500);
  }
};