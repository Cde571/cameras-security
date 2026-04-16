import { getSqlClient } from "../db/client";

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
    const rows = await sql`
      SELECT
        id::text AS id,
        nombre,
        email,
        coalesce(role, 'ventas') AS role,
        coalesce(activo, true) AS activo
      FROM usuarios
      WHERE
        lower(email) = lower(${email})
        AND activo = true
        AND password_hash = crypt(${password}, password_hash)
      LIMIT 1
    `;

    const user = rows[0] ?? null;

    if (user) {
      await sql`
        UPDATE usuarios
        SET ultimo_acceso = now(), updated_at = now()
        WHERE id = ${user.id}::uuid
      `;
    }

    return user;
  } catch (error: any) {
    throw new Error(
      error?.message?.includes('usuarios')
        ? "No fue posible consultar la tabla usuarios. Ejecuta migraciones y bootstrap de autenticación."
        : (error?.message || "No fue posible autenticar el usuario")
    );
  }
}