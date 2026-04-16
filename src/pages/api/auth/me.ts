import type { APIRoute } from "astro";
import { SESSION_COOKIE_NAME, verifySessionCookie } from "../../../lib/auth/session";
import { getUserById } from "../../../lib/server/authUsers";

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
    const sessionUser = verifySessionCookie(token);

    if (!sessionUser) {
      return new Response(JSON.stringify({ ok: false, user: null }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await getUserById(sessionUser.id);

    if (!user) {
      cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
      return new Response(JSON.stringify({ ok: false, user: null }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error?.message || "No fue posible obtener la sesión",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
