import { getSqlClient } from "../db/client";
import { verifyPassword } from "../auth/session";

export type AuthUser = {
  id: string;
  nombre: string;
  email: string;
  role: string;
  activo: boolean;
};

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  const sql = getSqlClient();

  const rows = await sql`
    SELECT
      id::text AS id,
      nombre,
      email,
      coalesce(role, 'ventas') AS role,
      coalesce(activo, true) AS activo
    FROM usuarios
    WHERE lower(email) = lower(${email})
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const sql = getSqlClient();

  try {
    // Traemos el usuario + password_hash por separado
    const rows = await sql`
      SELECT
        id::text AS id,
        nombre,
        email,
        coalesce(role, 'ventas') AS role,
        coalesce(activo, true) AS activo,
        password_hash
      FROM usuarios
      WHERE lower(email) = lower(${email})
        AND activo = true
      LIMIT 1
    `;

    const row = rows[0] ?? null;
    if (!row) return null;

    // Verificamos el hash en Node (compatible con bootstrap-auth)
    const valid = verifyPassword(password, row.password_hash);
    if (!valid) return null;

    const user: AuthUser = {
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      role: row.role,
      activo: row.activo,
    };

    await sql`
      UPDATE usuarios
      SET ultimo_acceso = now(), updated_at = now()
      WHERE id = ${user.id}::uuid
    `;

    return user;
  } catch (error: any) {
    throw new Error(
      error?.message?.includes("usuarios")
        ? "No fue posible consultar la tabla usuarios. Ejecuta migraciones y bootstrap de autenticación."
        : error?.message || "No fue posible autenticar el usuario"
    );
  }
}