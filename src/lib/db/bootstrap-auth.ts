import "dotenv/config";
import { getSqlClient } from "./client";
import { hashPassword } from "../auth/session";

async function run() {
  const sql = getSqlClient();

  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await sql`
    CREATE TABLE IF NOT EXISTS usuarios (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre text NOT NULL,
      email text NOT NULL UNIQUE,
      role text NOT NULL DEFAULT 'admin',
      activo boolean NOT NULL DEFAULT true,
      password_hash text NOT NULL,
      ultimo_acceso timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS role text
  `;

  await sql`
    UPDATE usuarios
    SET role = COALESCE(role, rol, 'ventas')
    WHERE role IS NULL OR trim(role) = ''
  `.catch(() => {});

  await sql`
    ALTER TABLE usuarios
    ALTER COLUMN role SET DEFAULT 'admin'
  `;

  const adminName = process.env.ADMIN_NAME?.trim() || "Administrador";
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || "admin@empresa.com";
  const adminPassword = process.env.ADMIN_PASSWORD?.trim() || "admin123";
  const passwordHash = hashPassword(adminPassword);

  await sql`
    INSERT INTO usuarios (nombre, email, role, activo, password_hash)
    VALUES (${adminName}, ${adminEmail}, 'admin', true, ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      role = EXCLUDED.role,
      activo = true,
      password_hash = EXCLUDED.password_hash,
      updated_at = now()
  `;

  console.log("Tabla usuarios lista.");
  console.log(`Admin: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("bootstrap-auth error:", error);
    process.exit(1);
  });