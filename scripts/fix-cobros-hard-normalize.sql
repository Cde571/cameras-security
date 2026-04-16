CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'id'
  ) THEN
    RAISE EXCEPTION 'La tabla cuentas_cobro no existe o no tiene columna id';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'numero'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN numero text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'cliente_id'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN cliente_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'fecha_emision'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN fecha_emision date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'fecha_vencimiento'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN fecha_vencimiento date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'status'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN status text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN subtotal numeric(14,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'iva'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN iva numeric(14,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'total'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN total numeric(14,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'observaciones'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN observaciones text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN created_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuentas_cobro' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE cuentas_cobro ADD COLUMN updated_at timestamptz;
  END IF;
END $$;

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
  numero = COALESCE(NULLIF(numero, ''), 'CC-' || extract(epoch from now())::bigint),
  fecha_emision = COALESCE(fecha_emision, current_date),
  status = COALESCE(NULLIF(status, ''), 'pendiente'),
  subtotal = COALESCE(subtotal, total, 0),
  iva = COALESCE(iva, 0),
  total = COALESCE(total, subtotal, 0),
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now());

ALTER TABLE cuentas_cobro
  ALTER COLUMN numero SET NOT NULL;

ALTER TABLE cuentas_cobro
  ALTER COLUMN fecha_emision SET DEFAULT current_date;

ALTER TABLE cuentas_cobro
  ALTER COLUMN status SET DEFAULT 'pendiente';

ALTER TABLE cuentas_cobro
  ALTER COLUMN subtotal SET DEFAULT 0;

ALTER TABLE cuentas_cobro
  ALTER COLUMN iva SET DEFAULT 0;

ALTER TABLE cuentas_cobro
  ALTER COLUMN total SET DEFAULT 0;

ALTER TABLE cuentas_cobro
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE cuentas_cobro
  ALTER COLUMN updated_at SET DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'cuenta_cobro_items'
  ) THEN
    CREATE TABLE cuenta_cobro_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      cuenta_cobro_id uuid NOT NULL REFERENCES cuentas_cobro(id) ON DELETE CASCADE,
      descripcion text NOT NULL,
      cantidad numeric(14,2) NOT NULL DEFAULT 1,
      valor_unitario numeric(14,2) NOT NULL DEFAULT 0,
      subtotal numeric(14,2) NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'cuenta_cobro_id'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN cuenta_cobro_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'descripcion'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN descripcion text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'cantidad'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN cantidad numeric(14,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'valor_unitario'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN valor_unitario numeric(14,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN subtotal numeric(14,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN created_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN updated_at timestamptz;
  END IF;
END $$;

UPDATE cuenta_cobro_items
SET
  descripcion = COALESCE(NULLIF(descripcion, ''), 'Servicio'),
  cantidad = COALESCE(cantidad, 1),
  valor_unitario = COALESCE(valor_unitario, 0),
  subtotal = COALESCE(subtotal, COALESCE(cantidad,1) * COALESCE(valor_unitario,0), 0),
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now());

ALTER TABLE cuenta_cobro_items
  ALTER COLUMN descripcion SET NOT NULL;

ALTER TABLE cuenta_cobro_items
  ALTER COLUMN cantidad SET DEFAULT 1;

ALTER TABLE cuenta_cobro_items
  ALTER COLUMN valor_unitario SET DEFAULT 0;

ALTER TABLE cuenta_cobro_items
  ALTER COLUMN subtotal SET DEFAULT 0;

ALTER TABLE cuenta_cobro_items
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE cuenta_cobro_items
  ALTER COLUMN updated_at SET DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'cuenta_cobro_items'
      AND constraint_type = 'FOREIGN KEY'
      AND constraint_name = 'cuenta_cobro_items_cuenta_cobro_id_fkey'
  ) THEN
    BEGIN
      ALTER TABLE cuenta_cobro_items
      ADD CONSTRAINT cuenta_cobro_items_cuenta_cobro_id_fkey
      FOREIGN KEY (cuenta_cobro_id) REFERENCES cuentas_cobro(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;
END $$;

SELECT 'cuentas_cobro columnas' AS info, column_name
FROM information_schema.columns
WHERE table_name = 'cuentas_cobro'
UNION ALL
SELECT 'cuenta_cobro_items columnas' AS info, column_name
FROM information_schema.columns
WHERE table_name = 'cuenta_cobro_items';