import { v as verifySessionCookie } from '../../../chunks/session_DJwukWEj.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Vary": "Cookie"
    }
  });
}
const GET = async ({ locals, cookies }) => {
  let user = locals?.user ?? null;
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
      role: user.role ?? "user"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
