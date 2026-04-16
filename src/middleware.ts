import type { MiddlewareHandler } from "astro";
import { getSessionFromRequest } from "./lib/auth/session";

const PUBLIC_PATHS = [
  "/auth/login",
  "/api/auth/login",
  "/api/auth/me",
  "/api/auth/logout",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

function isStaticPath(pathname: string) {
  return (
    pathname.startsWith("/_astro") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt)$/i) !== null
  );
}

function json(status: number, data: Record<string, any>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function redirect(location: string) {
  return Response.redirect(location, 302);
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, url, locals } = context;
  const pathname = url.pathname;

  if (isStaticPath(pathname) || isPublicPath(pathname)) {
    return next();
  }

  const user = getSessionFromRequest(request);

  if (!user) {
    if (pathname.startsWith("/api/")) {
      return json(401, { ok: false, error: "No autenticado" });
    }

    const nextUrl = encodeURIComponent(`${pathname}${url.search}`);
    return redirect(`/auth/login?next=${nextUrl}`);
  }

  locals.user = user;
  return next();
};