CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS impuestos_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL DEFAULT 'IVA',
  descripcion text DEFAULT '',
  porcentaje numeric(10,4) NOT NULL DEFAULT 19,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_impuestos_config_updated_at ON impuestos_config;
CREATE TRIGGER trg_impuestos_config_updated_at
BEFORE UPDATE ON impuestos_config
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO impuestos_config (
  nombre, descripcion, porcentaje, activo
)
SELECT
  'IVA',
  'Impuesto al valor agregado',
  19,
  true
WHERE NOT EXISTS (SELECT 1 FROM impuestos_config);

SELECT count(*)::int AS total FROM impuestos_config;