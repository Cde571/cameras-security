import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { v as verifyPassword, s as signSessionCookie, S as SESSION_COOKIE_NAME } from '../../../chunks/session_Z8sAdXym.mjs';
export { renderers } from '../../../renderers.mjs';

let _client = null;
let _db = null;
function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim() || "";
  if (!url) {
    throw new Error("Falta DATABASE_URL en el entorno");
  }
  return url;
}
function getSqlClient() {
  if (_client) return _client;
  _client = postgres(resolveDatabaseUrl(), {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false
  });
  return _client;
}
function getDb() {
  if (_db) return _db;
  _db = drizzle(getSqlClient());
  return _db;
}
new Proxy({}, {
  get(_target, prop) {
    return getDb()[prop];
  }
});

function normalizeRole(value) {
  if (value === "admin" || value === "tecnico" || value === "ventas") return value;
  return "ventas";
}
function mapUser(row) {
  return {
    id: String(row.id),
    name: String(row.nombre ?? "Usuario"),
    email: String(row.email ?? ""),
    role: normalizeRole(row.rol)
  };
}
function normalizeRow(row) {
  return {
    id: String(row.id),
    nombre: String(row.nombre ?? "Usuario"),
    email: String(row.email ?? ""),
    rol: String(row.rol ?? "ventas"),
    activo: row.activo === false ? false : true,
    password_hash: String(row.password_hash ?? "")
  };
}
async function getUserByEmail(email) {
  const sql = getSqlClient();
  try {
    const rows = await sql`
      SELECT
        id::text,
        nombre,
        email,
        rol,
        activo,
        password_hash
      FROM usuarios
      WHERE lower(email) = lower(${email})
      LIMIT 1
    `;
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return normalizeRow(rows[0]);
  } catch (error) {
    throw new Error(
      "No fue posible consultar la tabla usuarios. Ejecuta el bootstrap de autenticación."
    );
  }
}
async function authenticateUser(email, password) {
  const user = await getUserByEmail(email);
  if (!user || !user.activo) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return mapUser(user);
}
async function touchUserLogin(id) {
  const sql = getSqlClient();
  try {
    await sql`
      UPDATE usuarios
      SET ultimo_acceso = now()
      WHERE id = ${id}::uuid
    `;
  } catch {
  }
}

const POST = async ({ request, cookies }) => {
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
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    await touchUserLogin(user.id);
    return new Response(JSON.stringify({ ok: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[api/auth/login] error:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: error?.message || "No fue posible iniciar sesión"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
