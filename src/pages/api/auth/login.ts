import type { APIRoute } from "astro";
import { authenticateUser } from "../../../lib/server/authUsers";
import { setSessionCookie } from "../../../lib/auth/session";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim();
    const password = String(body?.password ?? "");

    console.log("[auth/login] payload", { email, hasPassword: Boolean(password) });

    if (!email || !password) {
      return new Response(
        JSON.stringify({ ok: false, error: "Email y contraseña son obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await authenticateUser(email, password);
    console.log("[auth/login] user", user);

    if (!user) {
      return new Response(
        JSON.stringify({ ok: false, error: "Credenciales inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const headers = new Headers({ "Content-Type": "application/json" });
    setSessionCookie(headers, {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          role: user.role,
        },
      }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error("[auth/login] ERROR:", error);
    console.error("[auth/login] STACK:", error?.stack);

    return new Response(
      JSON.stringify({
        ok: false,
        error: error?.message || "No fue posible iniciar sesión",
        stack: error?.stack ?? null,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};