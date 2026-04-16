import type { APIRoute } from "astro";
import { getSessionFromRequest } from "../../../lib/auth/session";

export const GET: APIRoute = async ({ request }) => {
  const session = getSessionFromRequest(request);

  if (!session) {
    return new Response(
      JSON.stringify({ ok: false, user: null }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true, user: session }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};