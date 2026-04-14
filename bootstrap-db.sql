CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  documento text,
  email text,
  telefono text,
  ciudad text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cotizaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  version integer DEFAULT 1,
  fecha date NOT NULL DEFAULT current_date,
  vigencia_dias integer DEFAULT 30,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  asunto text,
  subtotal numeric(14,2) DEFAULT 0,
  iva numeric(14,2) DEFAULT 0,
  total numeric(14,2) DEFAULT 0,
  status text DEFAULT 'borrador',
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cotizacion_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cotizacion_id uuid NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE,
  producto_id uuid,
  nombre text NOT NULL,
  kind text DEFAULT 'producto',
  qty numeric(12,2) DEFAULT 0,
  precio numeric(14,2) DEFAULT 0,
  iva_pct numeric(6,2) DEFAULT 0,
  subtotal numeric(14,2) DEFAULT 0,
  total numeric(14,2) DEFAULT 0,
  order_index integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ordenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  cotizacion_id uuid REFERENCES cotizaciones(id) ON DELETE SET NULL,
  fecha date DEFAULT current_date,
  estado text DEFAULT 'pendiente',
  tecnico text,
  checklist jsonb DEFAULT '[]'::jsonb,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cuentas_cobro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  fecha date DEFAULT current_date,
  referencia text,
  subtotal numeric(14,2) DEFAULT 0,
  iva numeric(14,2) DEFAULT 0,
  total numeric(14,2) DEFAULT 0,
  estado text DEFAULT 'pendiente',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pagos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuenta_cobro_id uuid REFERENCES cuentas_cobro(id) ON DELETE SET NULL,
  fecha date DEFAULT current_date,
  valor numeric(14,2) DEFAULT 0,
  metodo text,
  referencia text,
  notas text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente_id ON cotizaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizacion_items_cotizacion_id ON cotizacion_items(cotizacion_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_cliente_id ON ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cuentas_cobro_cliente_id ON cuentas_cobro(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pagos_cuenta_cobro_id ON pagos(cuenta_cobro_id);
