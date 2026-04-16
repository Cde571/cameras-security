CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS cuentas_cobro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  fecha_emision date NOT NULL DEFAULT current_date,
  fecha_vencimiento date,
  status text NOT NULL DEFAULT 'pendiente',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  iva numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  observaciones text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cuenta_cobro_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuenta_cobro_id uuid NOT NULL REFERENCES cuentas_cobro(id) ON DELETE CASCADE,
  descripcion text NOT NULL,
  cantidad numeric(14,2) NOT NULL DEFAULT 1,
  valor_unitario numeric(14,2) NOT NULL DEFAULT 0,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_cuentas_cobro_updated_at ON cuentas_cobro;
CREATE TRIGGER trg_cuentas_cobro_updated_at
BEFORE UPDATE ON cuentas_cobro
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_cuenta_cobro_items_updated_at ON cuenta_cobro_items;
CREATE TRIGGER trg_cuenta_cobro_items_updated_at
BEFORE UPDATE ON cuenta_cobro_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO cuentas_cobro (
  numero,
  cliente_id,
  fecha_emision,
  fecha_vencimiento,
  status,
  subtotal,
  iva,
  total,
  observaciones
)
SELECT
  'CC-2026-0001',
  (SELECT id FROM clientes ORDER BY created_at ASC LIMIT 1),
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '15 day',
  'pendiente',
  350000,
  0,
  350000,
  'Cuenta de cobro inicial sembrada para pruebas.'
WHERE NOT EXISTS (SELECT 1 FROM cuentas_cobro);

INSERT INTO cuenta_cobro_items (
  cuenta_cobro_id,
  descripcion,
  cantidad,
  valor_unitario,
  subtotal
)
SELECT
  (SELECT id FROM cuentas_cobro ORDER BY created_at ASC LIMIT 1),
  'Servicio de instalación y configuración',
  1,
  350000,
  350000
WHERE NOT EXISTS (SELECT 1 FROM cuenta_cobro_items);

SELECT 'cuentas_cobro' AS tabla, count(*) AS total FROM cuentas_cobro
UNION ALL
SELECT 'cuenta_cobro_items' AS tabla, count(*) AS total FROM cuenta_cobro_items;