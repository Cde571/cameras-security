CREATE TABLE IF NOT EXISTS kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  codigo text,
  descripcion text,
  activo boolean NOT NULL DEFAULT true,
  costo_total numeric(14,2) NOT NULL DEFAULT 0,
  precio_total numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id uuid NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  producto_id uuid,
  nombre text NOT NULL,
  cantidad numeric(14,2) NOT NULL DEFAULT 1,
  costo_unitario numeric(14,2) NOT NULL DEFAULT 0,
  precio_unitario numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE productos ADD COLUMN IF NOT EXISTS codigo text;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS sku text;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS descripcion text;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria text;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS unidad text;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS costo numeric(14,2) DEFAULT 0;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS precio numeric(14,2) DEFAULT 0;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS iva numeric(14,2) DEFAULT 0;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS stock numeric(14,2) DEFAULT 0;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true;
