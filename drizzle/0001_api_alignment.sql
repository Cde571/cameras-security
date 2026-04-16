ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS sku varchar(120);

ALTER TABLE kits
  ADD COLUMN IF NOT EXISTS descuento_pct numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS precio_fijo numeric(14,2);

ALTER TABLE ordenes
  ADD COLUMN IF NOT EXISTS fecha_programada date,
  ADD COLUMN IF NOT EXISTS asunto varchar(220),
  ADD COLUMN IF NOT EXISTS direccion_servicio varchar(220),
  ADD COLUMN IF NOT EXISTS tecnico_id varchar(120),
  ADD COLUMN IF NOT EXISTS evidencias jsonb DEFAULT '[]'::jsonb;

ALTER TABLE cuentas_cobro
  ADD COLUMN IF NOT EXISTS fecha_vencimiento date;

ALTER TABLE pagos
  ADD COLUMN IF NOT EXISTS referencia varchar(180),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE acta_activos
  ADD COLUMN IF NOT EXISTS notas text;

CREATE TABLE IF NOT EXISTS cotizacion_plantillas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre varchar(180) NOT NULL,
  cuerpo text NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO cotizacion_plantillas (nombre, cuerpo, activo)
SELECT
  'Plantilla estándar',
  E'• Garantía: 12 meses por defectos de fabricación.\n• Instalación: incluye canaleta básica, configuración y pruebas.\n• Forma de pago: 50% anticipo, 50% contra entrega.\n• Vigencia: 15 días.\n• Tiempos: 2 a 5 días hábiles según agenda.',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM cotizacion_plantillas WHERE lower(nombre) = lower('Plantilla estándar')
);
