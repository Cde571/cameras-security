CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL UNIQUE,
  rol text NOT NULL DEFAULT 'admin',
  activo boolean NOT NULL DEFAULT true,
  password_hash text NOT NULL,
  ultimo_acceso timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO usuarios (nombre, email, rol, activo, password_hash)
VALUES ('Administrador', 'admin@empresa.com', 'admin', true, 'admin123')
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  rol = EXCLUDED.rol,
  activo = EXCLUDED.activo,
  password_hash = EXCLUDED.password_hash,
  updated_at = now();
