CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS cotizacion_plantillas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  cuerpo text NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO cotizacion_plantillas (nombre, cuerpo, activo)
SELECT
  'Plantilla estándar',
  E'• Garantía: 12 meses.\n• Forma de pago: 50% anticipo y 50% contra entrega.\n• Vigencia: 15 días.\n• Tiempo de entrega sujeto a disponibilidad.',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM cotizacion_plantillas
);

SELECT id, nombre, activo FROM cotizacion_plantillas;
