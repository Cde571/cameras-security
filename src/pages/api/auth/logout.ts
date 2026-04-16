import type { APIRoute } from "astro";
import { clearSessionCookie } from "../../../lib/auth/session";

export const POST: APIRoute = async () => {
  const headers = new Headers({ "Content-Type": "application/json" });
  clearSessionCookie(headers);

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers }
  );
};