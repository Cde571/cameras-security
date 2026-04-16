DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'cuenta_cobro_items'
  ) THEN
    RAISE EXCEPTION 'La tabla cuenta_cobro_items no existe';
  END IF;

  -- Si no existe descripcion, crearla
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'descripcion'
  ) THEN
    ALTER TABLE cuenta_cobro_items ADD COLUMN descripcion text;
  END IF;

  -- Si existe concepto, copiar a descripcion cuando haga falta
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'cuenta_cobro_items' AND column_name = 'concepto'
  ) THEN
    EXECUTE '
      UPDATE cuenta_cobro_items
      SET descripcion = COALESCE(NULLIF(descripcion, ''''), concepto, ''Servicio'')
      WHERE descripcion IS NULL OR descripcion = ''''
    ';

    EXECUTE '
      UPDATE cuenta_cobro_items
      SET concepto = COALESCE(NULLIF(concepto, ''''), descripcion, ''Servicio'')
      WHERE concepto IS NULL OR concepto = ''''
    ';

    -- Dejar concepto opcional para que el backend nuevo no falle
    BEGIN
      ALTER TABLE cuenta_cobro_items ALTER COLUMN concepto DROP NOT NULL;
    EXCEPTION WHEN others THEN
      NULL;
    END;

    BEGIN
      ALTER TABLE cuenta_cobro_items ALTER COLUMN concepto SET DEFAULT 'Servicio';
    EXCEPTION WHEN others THEN
      NULL;
    END;
  END IF;

  -- Asegurar descripcion usable
  UPDATE cuenta_cobro_items
  SET descripcion = COALESCE(NULLIF(descripcion, ''), 'Servicio')
  WHERE descripcion IS NULL OR descripcion = '';

  BEGIN
    ALTER TABLE cuenta_cobro_items ALTER COLUMN descripcion SET DEFAULT 'Servicio';
  EXCEPTION WHEN others THEN
    NULL;
  END;

  -- Si se puede, dejar descripcion NOT NULL
  BEGIN
    ALTER TABLE cuenta_cobro_items ALTER COLUMN descripcion SET NOT NULL;
  EXCEPTION WHEN others THEN
    NULL;
  END;
END $$;

SELECT
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cuenta_cobro_items'
  AND column_name IN ('concepto', 'descripcion')
ORDER BY column_name;