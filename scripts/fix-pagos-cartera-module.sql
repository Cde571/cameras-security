CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS pagos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuenta_cobro_id uuid REFERENCES cuentas_cobro(id) ON DELETE SET NULL,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  fecha date NOT NULL DEFAULT current_date,
  metodo text NOT NULL DEFAULT 'transferencia',
  referencia text,
  valor numeric(14,2) NOT NULL DEFAULT 0,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_pagos_updated_at ON pagos;
CREATE TRIGGER trg_pagos_updated_at
BEFORE UPDATE ON pagos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO pagos (
  cuenta_cobro_id,
  cliente_id,
  fecha,
  metodo,
  referencia,
  valor,
  notas
)
SELECT
  cc.id,
  cc.cliente_id,
  CURRENT_DATE,
  'transferencia',
  'PAGO-INICIAL-001',
  100000,
  'Pago inicial de prueba.'
FROM cuentas_cobro cc
WHERE NOT EXISTS (SELECT 1 FROM pagos)
LIMIT 1;

SELECT 'pagos' AS tabla, count(*) AS total FROM pagos;