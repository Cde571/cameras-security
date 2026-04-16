import type { MiddlewareHandler } from "astro";
import { SESSION_COOKIE_NAME, verifySessionCookie } from "./lib/auth/session";
import { getAllowedRolesForPath, hasAnyRole, isPublicPath } from "./lib/auth/roles";

function json(status: number, body: Record<string, any>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isApiPath(pathname: string) {
  return pathname.startsWith("/api/");
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { url, cookies, redirect, locals } = context;
  const pathname = url.pathname;

  if (isPublicPath(pathname)) {
    return next();
  }

  const token = cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  const user = verifySessionCookie(token);

  if (!user) {
    if (isApiPath(pathname)) {
      return json(401, { ok: false, error: "No autenticado" });
    }

    const nextUrl = encodeURIComponent(`${pathname}${url.search}`);
    return redirect(`/auth/login?next=${nextUrl}`);
  }

  const allowedRoles = getAllowedRolesForPath(pathname);
  if (!hasAnyRole(user.role, allowedRoles)) {
    if (isApiPath(pathname)) {
      return json(403, { ok: false, error: "No autorizado para este recurso" });
    }

    return redirect("/?forbidden=1");
  }

  (locals as any).user = user;
  return next();
};
