CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS plantillas_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL DEFAULT 'Plantilla',
  tipo text NOT NULL DEFAULT 'general',
  contenido text NOT NULL DEFAULT '',
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_plantillas_config_updated_at ON plantillas_config;
CREATE TRIGGER trg_plantillas_config_updated_at
BEFORE UPDATE ON plantillas_config
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO plantillas_config (
  nombre, tipo, contenido, activo
)
SELECT
  'Plantilla base',
  'general',
  'Contenido inicial de plantilla.',
  true
WHERE NOT EXISTS (SELECT 1 FROM plantillas_config);

SELECT count(*)::int AS total FROM plantillas_config;