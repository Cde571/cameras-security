import { c as createSessionCookie } from '../../../chunks/session_DJwukWEj.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  try {
    const contentType = request.headers.get("content-type") || "";
    let email = "";
    let password = "";
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => null);
      if (!body) {
        return new Response(JSON.stringify({ ok: false, message: "Cuerpo de solicitud inválido" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        });
      }
      email = (body?.email ?? "").toString().trim().toLowerCase();
      password = (body?.password ?? "").toString().trim();
    } else {
      const formData = await request.formData().catch(() => null);
      if (!formData) {
        return new Response(JSON.stringify({ ok: false, message: "Cuerpo de solicitud inválido" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        });
      }
      email = (formData.get("email") ?? "").toString().trim().toLowerCase();
      password = (formData.get("password") ?? "").toString().trim();
    }
    if (!email || !password) {
      return new Response(JSON.stringify({ ok: false, message: "Datos incompletos" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    }
    if (!(email === "admin@empresa.com" && password === "admin123")) {
      return new Response(JSON.stringify({ ok: false, message: "Credenciales inválidas" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    }
    const token = createSessionCookie({
      id: "admin-1",
      name: "Admin",
      email,
      role: "admin"
    });
    cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,
      // en DEV => false
      maxAge: 60 * 60 * 24 * 7
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Vary": "Cookie"
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return new Response(JSON.stringify({ ok: false, message: "Error interno del servidor" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
