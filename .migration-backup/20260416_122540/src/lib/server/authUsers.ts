import { getSqlClient } from "../db/client";
import { verifyPassword, type SessionUser, type UserRole } from "../auth/session";

type DbUserRow = {
  id: string;
  nombre: string;
  email: string;
  role: string;
  activo: boolean;
  password_hash: string;
};

function normalizeRole(value: any): UserRole {
  if (value === "admin" || value === "tecnico" || value === "ventas") return value;
  return "ventas";
}

function mapUser(row: any): SessionUser {
  return {
    id: String(row.id),
    name: String(row.nombre ?? "Usuario"),
    email: String(row.email ?? ""),
    role: normalizeRole(row.role),
  };
}

function normalizeRow(row: any): DbUserRow {
  return {
    id: String(row.id),
    nombre: String(row.nombre ?? "Usuario"),
    email: String(row.email ?? ""),
    role: String(row.role ?? "ventas"),
    activo: row.activo === false ? false : true,
    password_hash: String(row.password_hash ?? ""),
  };
}

export async function getUserByEmail(email: string): Promise<DbUserRow | null> {
  const sql = getSqlClient();

  try {
    const rows = await sql`
      SELECT
        id::text,
        nombre,
        email,
        role,
        activo,
        password_hash
      FROM usuarios
      WHERE lower(email) = lower(${email})
      LIMIT 1
    `;

    if (!Array.isArray(rows) || rows.length === 0) return null;
    return normalizeRow(rows[0]);
  } catch {
    throw new Error(
      "No fue posible consultar la tabla usuarios. Ejecuta migraciones y bootstrap de autenticación."
    );
  }
}

export async function getUserById(id: string): Promise<SessionUser | null> {
  const sql = getSqlClient();

  try {
    const rows = await sql`
      SELECT
        id::text,
        nombre,
        email,
        role,
        activo
      FROM usuarios
      WHERE id = ${id}::uuid
      LIMIT 1
    `;

    if (!Array.isArray(rows) || rows.length === 0) return null;
    if (rows[0].activo === false) return null;

    return mapUser(rows[0]);
  } catch {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.activo) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return mapUser(user);
}

export async function touchUserLogin(id: string) {
  const sql = getSqlClient();

  try {
    await sql`
      UPDATE usuarios
      SET ultimo_acceso = now()
      WHERE id = ${id}::uuid
    `;
  } catch {
    // no-op
  }
}