CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS empresa_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL DEFAULT 'Omnivision',
  nit text DEFAULT '',
  email text DEFAULT '',
  telefono text DEFAULT '',
  direccion text DEFAULT '',
  ciudad text DEFAULT '',
  website text DEFAULT '',
  logo_url text DEFAULT '',
  resolucion text DEFAULT '',
  prefijo_cotizacion text DEFAULT 'COT',
  prefijo_orden text DEFAULT 'OT',
  prefijo_acta text DEFAULT 'ACT',
  prefijo_cobro text DEFAULT 'CC',
  moneda text DEFAULT 'COP',
  timezone text DEFAULT 'America/Bogota',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_empresa_config_updated_at ON empresa_config;
CREATE TRIGGER trg_empresa_config_updated_at
BEFORE UPDATE ON empresa_config
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO empresa_config (
  nombre, nit, email, telefono, direccion, ciudad, website, logo_url,
  resolucion, prefijo_cotizacion, prefijo_orden, prefijo_acta, prefijo_cobro,
  moneda, timezone
)
SELECT
  'Omnivision',
  '',
  'admin@empresa.com',
  '',
  '',
  '',
  '',
  '',
  '',
  'COT',
  'OT',
  'ACT',
  'CC',
  'COP',
  'America/Bogota'
WHERE NOT EXISTS (SELECT 1 FROM empresa_config);

SELECT count(*)::int AS total FROM empresa_config;