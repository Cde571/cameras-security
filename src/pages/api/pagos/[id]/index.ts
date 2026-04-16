import type { APIRoute } from "astro";
import { getSqlClient } from "../../../../lib/db/client";
import { jsonError } from "../../../../lib/server/api/response";

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = String(params.id ?? "");
    const sql = getSqlClient();

    await sql`DELETE FROM pagos WHERE id = ${id}::uuid`;
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return jsonError(error?.message || "No fue posible eliminar pago");
  }
};