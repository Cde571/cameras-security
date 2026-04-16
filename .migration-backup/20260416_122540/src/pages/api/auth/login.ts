import type { APIRoute } from "astro";
import { authenticateUser, touchUserLogin } from "../../../lib/server/authUsers";
import { SESSION_COOKIE_NAME, signSessionCookie } from "../../../lib/auth/session";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "").trim();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ ok: false, error: "Email y contraseña son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return new Response(
        JSON.stringify({ ok: false, error: "Credenciales inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = signSessionCookie(user);

    cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: import.meta.env.PROD,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    await touchUserLogin(user.id);

    return new Response(JSON.stringify({ ok: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[api/auth/login] error:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: error?.message || "No fue posible iniciar sesión",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
