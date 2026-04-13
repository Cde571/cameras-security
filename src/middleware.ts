// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

// 🚧 DEV MODE: sin seguridad, sin redirects, sin cookies, sin validaciones
export const onRequest = defineMiddleware(async (ctx, next) => {
  // Limpia cualquier sesión vieja para evitar loops raros (opcional)
  try {
    ctx.cookies.delete("session", { path: "/" });
  } catch {}

  return next();
});
