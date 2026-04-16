CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultimo_acceso timestamptz;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'usuarios'
      AND column_name = 'role'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN role text;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'usuarios'
      AND column_name = 'rol'
  ) THEN
    EXECUTE 'UPDATE usuarios SET role = COALESCE(NULLIF(role, ''''''), NULLIF(rol, ''''''), ''ventas'')';
  ELSE
    UPDATE usuarios SET role = COALESCE(NULLIF(role, ''), 'ventas');
  END IF;
END $$;

UPDATE usuarios
SET role = 'ventas'
WHERE role IS NULL OR btrim(role) = '';

ALTER TABLE usuarios ALTER COLUMN role SET DEFAULT 'ventas';
ALTER TABLE usuarios ALTER COLUMN role SET NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'usuarios'
      AND column_name = 'rol'
  ) THEN
    ALTER TABLE usuarios DROP COLUMN rol;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'usuarios_role_check'
  ) THEN
    ALTER TABLE usuarios
      ADD CONSTRAINT usuarios_role_check
      CHECK (role IN ('admin', 'tecnico', 'ventas'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_idx ON usuarios(email);
