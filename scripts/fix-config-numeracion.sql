CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS numeracion_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prefijo_cotizacion text NOT NULL DEFAULT 'COT',
  siguiente_cotizacion integer NOT NULL DEFAULT 1,
  padding_cotizacion integer NOT NULL DEFAULT 4,

  prefijo_orden text NOT NULL DEFAULT 'OT',
  siguiente_orden integer NOT NULL DEFAULT 1,
  padding_orden integer NOT NULL DEFAULT 4,

  prefijo_acta text NOT NULL DEFAULT 'ACT',
  siguiente_acta integer NOT NULL DEFAULT 1,
  padding_acta integer NOT NULL DEFAULT 4,

  prefijo_cobro text NOT NULL DEFAULT 'CC',
  siguiente_cobro integer NOT NULL DEFAULT 1,
  padding_cobro integer NOT NULL DEFAULT 4,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_numeracion_config_updated_at ON numeracion_config;
CREATE TRIGGER trg_numeracion_config_updated_at
BEFORE UPDATE ON numeracion_config
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO numeracion_config (
  prefijo_cotizacion, siguiente_cotizacion, padding_cotizacion,
  prefijo_orden, siguiente_orden, padding_orden,
  prefijo_acta, siguiente_acta, padding_acta,
  prefijo_cobro, siguiente_cobro, padding_cobro
)
SELECT
  'COT', 1, 4,
  'OT', 1, 4,
  'ACT', 1, 4,
  'CC', 1, 4
WHERE NOT EXISTS (SELECT 1 FROM numeracion_config);

SELECT count(*)::int AS total FROM numeracion_config;