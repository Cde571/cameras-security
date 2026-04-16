CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  -- cuentas_cobro
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'fecha_emision'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN fecha_emision date DEFAULT current_date;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'fecha_vencimiento'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN fecha_vencimiento date;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN subtotal numeric(14,2) NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'iva'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN iva numeric(14,2) NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'total'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN total numeric(14,2) NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'observaciones'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN observaciones text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'status'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN status text NOT NULL DEFAULT 'pendiente';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;

  -- cuenta_cobro_items
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'descripcion'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN descripcion text;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'cantidad'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN cantidad numeric(14,2) NOT NULL DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'valor_unitario'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN valor_unitario numeric(14,2) NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN subtotal numeric(14,2) NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Si la tabla vieja tenía columna "fecha", úsala para poblar fecha_emision
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'fecha'
  ) THEN
    EXECUTE '
      UPDATE cuentas_cobro
      SET fecha_emision = COALESCE(fecha_emision, fecha)
      WHERE fecha_emision IS NULL
    ';
  END IF;
END $$;

UPDATE cuentas_cobro
SET
  fecha_emision = COALESCE(fecha_emision, current_date),
  status = COALESCE(NULLIF(status, ''), 'pendiente'),
  subtotal = COALESCE(subtotal, total, 0),
  iva = COALESCE(iva, 0),
  total = COALESCE(total, subtotal, 0),
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now());

UPDATE cuenta_cobro_items
SET
  descripcion = COALESCE(NULLIF(descripcion, ''), 'Servicio'),
  cantidad = COALESCE(cantidad, 1),
  valor_unitario = COALESCE(valor_unitario, 0),
  subtotal = COALESCE(subtotal, cantidad * valor_unitario, 0),
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now());

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'cuentas_cobro'
ORDER BY ordinal_position;