// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { verifySessionCookie } from "./lib/auth/session";

const PUBLIC_PATHS = [
  "/auth/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/_image",
  "/favicon",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  try {
    const { pathname } = ctx.url;

    // Assets estáticos y rutas públicas pasan sin validación
    if (isPublic(pathname) || pathname.includes(".")) {
      return next();
    }

    // Validar cookie de sesión HMAC
    const token = ctx.cookies.get("session")?.value ?? null;
    const session = verifySessionCookie(token);

    if (!session) {
      const nextUrl = encodeURIComponent(pathname + ctx.url.search);
      return ctx.redirect(`/auth/login?next=${nextUrl}`, 302);
    }

    // Inyectar usuario para las páginas Astro
    ctx.locals.user = {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
    };

    return next();
  } catch (error) {
    // Nunca dejar que el middleware crashee la función serverless
    console.error("[middleware] error inesperado:", error);
    return next();
  }
});