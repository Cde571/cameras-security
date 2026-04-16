import type { APIRoute } from "astro";
import {
  getOrdenDb,
  updateOrdenDb,
  deleteOrdenDb,
} from "../../../lib/server/api/dbModels";

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = String(params.id ?? "");
    const row = await getOrdenDb(id);

    if (!row) {
      return json({ error: "Orden no encontrada" }, 404);
    }

    return json(row, 200);
  } catch (error: any) {
    console.error("[api/ordenes/:id][GET]", error);
    return json({ error: error?.message || "No fue posible consultar la orden" }, 500);
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const id = String(params.id ?? "");
    const body = await request.json();
    const updated = await updateOrdenDb(id, body);

    if (!updated) {
      return json({ error: "Orden no encontrada" }, 404);
    }

    return json(updated, 200);
  } catch (error: any) {
    console.error("[api/ordenes/:id][PATCH]", error);
    return json({ error: error?.message || "No fue posible actualizar la orden" }, 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = String(params.id ?? "");
    await deleteOrdenDb(id);
    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error("[api/ordenes/:id][DELETE]", error);
    return json({ error: error?.message || "No fue posible eliminar la orden" }, 500);
  }
};