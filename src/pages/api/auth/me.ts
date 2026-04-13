// src/pages/api/auth/me.ts
import type { APIRoute } from "astro";
import { verifySessionCookie } from "../../../lib/auth/session";

export const prerender = false;

function json(status: number, body: any) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Vary": "Cookie",
    },
  });
}

export const GET: APIRoute = async ({ locals, cookies }) => {
  // ✅ DEV: no seguridad → nunca 401 (evita loops)
  if (import.meta.env.DEV) {
    const devUser = (locals as any)?.user ?? {
      id: "dev-guest",
      name: "Dev User",
      email: "dev@local",
      role: "admin",
    };

    return json(200, {
      ok: true,
      authenticated: true,
      user: devUser,
      devBypass: true,
    });
  }

  // PROD: comportamiento real
  let user: any = (locals as any)?.user ?? null;

  if (!user?.id) {
    const token = cookies.get("session")?.value;

    if (!token) {
      return json(401, { ok: false, authenticated: false, message: "No autenticado" });
    }

    try {
      const session = verifySessionCookie(token);
      if (!session?.id) {
        cookies.delete("session", { path: "/" });
        return json(401, { ok: false, authenticated: false, message: "Sesión inválida" });
      }
      user = session;
    } catch {
      cookies.delete("session", { path: "/" });
      return json(401, { ok: false, authenticated: false, message: "Sesión expirada o inválida" });
    }
  }

  return json(200, {
    ok: true,
    authenticated: true,
    user: {
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
      role: user.role ?? "user",
    },
  });
};
