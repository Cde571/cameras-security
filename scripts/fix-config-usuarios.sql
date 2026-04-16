CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL DEFAULT 'Usuario',
  email text NOT NULL DEFAULT '',
  password_hash text NOT NULL DEFAULT '',
  rol text NOT NULL DEFAULT 'asesor',
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'nombre'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN nombre text NOT NULL DEFAULT 'Usuario';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'email'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN email text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN password_hash text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'rol'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN rol text NOT NULL DEFAULT 'asesor';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'activo'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN activo boolean NOT NULL DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO usuarios (
  nombre, email, password_hash, rol, activo
)
SELECT
  'Administrador',
  'admin@empresa.com',
  '',
  'admin',
  true
WHERE NOT EXISTS (SELECT 1 FROM usuarios);

SELECT count(*)::int AS total FROM usuarios;