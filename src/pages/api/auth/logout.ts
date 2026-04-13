export const prerender = false; // 👈 IMPORTANTE: Añade esto

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("session", { path: "/" });
  return redirect("/auth/login", 302);
};

// Soporte para GET (enlaces directos)
export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("session", { path: "/" });
  return redirect("/auth/login", 302);
};