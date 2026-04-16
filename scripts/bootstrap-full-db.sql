CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- HELPERS
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- USUARIOS / AUTH
-- =========================
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  ultimo_acceso timestamptz
);

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================
-- CONFIGURACIÓN
-- =========================
CREATE TABLE IF NOT EXISTS empresa_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  nit text,
  telefono text,
  email text,
  direccion text,
  ciudad text,
  website text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_empresa_config_updated_at ON empresa_config;
CREATE TRIGGER trg_empresa_config_updated_at
BEFORE UPDATE ON empresa_config
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS impuestos_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iva_default integer NOT NULL DEFAULT 19,
  moneda text NOT NULL DEFAULT 'COP',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_impuestos_config_updated_at ON impuestos_config;
CREATE TRIGGER trg_impuestos_config_updated_at
BEFORE UPDATE ON impuestos_config
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS numeracion_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cotizacion_prefix text NOT NULL DEFAULT 'COT',
  orden_prefix text NOT NULL DEFAULT 'OT',
  acta_prefix text NOT NULL DEFAULT 'ACT',
  cobro_prefix text NOT NULL DEFAULT 'CC',
  cotizacion_seq integer NOT NULL DEFAULT 0,
  orden_seq integer NOT NULL DEFAULT 0,
  acta_seq integer NOT NULL DEFAULT 0,
  cobro_seq integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_numeracion_config_updated_at ON numeracion_config;
CREATE TRIGGER trg_numeracion_config_updated_at
BEFORE UPDATE ON numeracion_config
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================
-- CLIENTES
-- =========================
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  documento text,
  email text,
  telefono text,
  direccion text,
  ciudad text,
  notas text,
  estado text NOT NULL DEFAULT 'activo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_clientes_updated_at ON clientes;
CREATE TRIGGER trg_clientes_updated_at
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_documento ON clientes(documento);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);

-- =========================
-- PRODUCTOS / CATEGORÍAS
-- =========================
CREATE TABLE IF NOT EXISTS categorias_producto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  descripcion text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  codigo text,
  sku text,
  descripcion text,
  categoria text,
  categoria_id uuid REFERENCES categorias_producto(id) ON DELETE SET NULL,
  unidad text DEFAULT 'unidad',
  costo numeric(14,2) NOT NULL DEFAULT 0,
  precio numeric(14,2) NOT NULL DEFAULT 0,
  iva numeric(6,2) NOT NULL DEFAULT 19,
  iva_pct integer NOT NULL DEFAULT 19,
  stock numeric(14,2) NOT NULL DEFAULT 0,
  marca text,
  activo boolean NOT NULL DEFAULT true,
  estado text NOT NULL DEFAULT 'activo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_productos_updated_at ON productos;
CREATE TRIGGER trg_productos_updated_at
BEFORE UPDATE ON productos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);

-- =========================
-- KITS
-- =========================
CREATE TABLE IF NOT EXISTS kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  codigo text,
  descripcion text,
  costo_total numeric(14,2) NOT NULL DEFAULT 0,
  precio_total numeric(14,2) NOT NULL DEFAULT 0,
  precio numeric(14,2) NOT NULL DEFAULT 0,
  descuento_pct numeric(5,2) DEFAULT 0,
  precio_fijo numeric(14,2),
  activo boolean NOT NULL DEFAULT true,
  estado text NOT NULL DEFAULT 'activo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_kits_updated_at ON kits;
CREATE TRIGGER trg_kits_updated_at
BEFORE UPDATE ON kits
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS kit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id uuid NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  producto_id uuid REFERENCES productos(id) ON DELETE SET NULL,
  nombre text,
  cantidad numeric(14,2) NOT NULL DEFAULT 1,
  qty integer NOT NULL DEFAULT 1,
  costo_unitario numeric(14,2) NOT NULL DEFAULT 0,
  precio_unitario numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kit_items_kit_id ON kit_items(kit_id);
CREATE INDEX IF NOT EXISTS idx_kit_items_producto_id ON kit_items(producto_id);

-- =========================
-- COTIZACIONES
-- =========================
CREATE TABLE IF NOT EXISTS cotizaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  version integer NOT NULL DEFAULT 1,
  fecha date NOT NULL DEFAULT current_date,
  vigencia_dias integer NOT NULL DEFAULT 30,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  asunto text,
  condiciones text,
  notas text,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  iva numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'borrador',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_cotizaciones_updated_at ON cotizaciones;
CREATE TRIGGER trg_cotizaciones_updated_at
BEFORE UPDATE ON cotizaciones
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente_id ON cotizaciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_status ON cotizaciones(status);

CREATE TABLE IF NOT EXISTS cotizacion_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cotizacion_id uuid NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE,
  producto_id uuid REFERENCES productos(id) ON DELETE SET NULL,
  descripcion text,
  nombre text,
  cantidad integer DEFAULT 1,
  qty numeric(14,2) NOT NULL DEFAULT 1,
  unidad text,
  precio_unitario numeric(14,2) DEFAULT 0,
  precio numeric(14,2) NOT NULL DEFAULT 0,
  iva_pct numeric(6,2) NOT NULL DEFAULT 19,
  costo numeric(14,2) DEFAULT 0,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_cotizacion_items_cotizacion_id ON cotizacion_items(cotizacion_id);

-- =========================
-- ÓRDENES
-- =========================
CREATE TABLE IF NOT EXISTS ordenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  cotizacion_id uuid REFERENCES cotizaciones(id) ON DELETE SET NULL,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  estado text NOT NULL DEFAULT 'pendiente',
  status text NOT NULL DEFAULT 'pendiente',
  fecha date NOT NULL DEFAULT current_date,
  fecha_programada date,
  asunto text,
  direccion_servicio text,
  tecnico text,
  tecnico_id text,
  checklist jsonb DEFAULT '[]'::jsonb,
  evidencias jsonb DEFAULT '[]'::jsonb,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_ordenes_updated_at ON ordenes;
CREATE TRIGGER trg_ordenes_updated_at
BEFORE UPDATE ON ordenes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_ordenes_cliente_id ON ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_cotizacion_id ON ordenes(cotizacion_id);

-- =========================
-- ACTAS
-- =========================
CREATE TABLE IF NOT EXISTS actas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  orden_id uuid REFERENCES ordenes(id) ON DELETE SET NULL,
  descripcion text,
  fecha date NOT NULL DEFAULT current_date,
  lugar text,
  estado text NOT NULL DEFAULT 'borrador',
  tecnico text,
  recibe text,
  documento_recibe text,
  observaciones text,
  firma_tecnico text,
  firma_cliente text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_actas_updated_at ON actas;
CREATE TRIGGER trg_actas_updated_at
BEFORE UPDATE ON actas
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS acta_activos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  acta_id uuid NOT NULL REFERENCES actas(id) ON DELETE CASCADE,
  tipo text,
  descripcion text NOT NULL,
  cantidad integer NOT NULL DEFAULT 1,
  serial text,
  ubicacion text,
  notas text
);

CREATE INDEX IF NOT EXISTS idx_acta_activos_acta_id ON acta_activos(acta_id);

-- =========================
-- CUENTAS DE COBRO / COBROS
-- =========================
CREATE TABLE IF NOT EXISTS cuentas_cobro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  fecha date NOT NULL DEFAULT current_date,
  fecha_vencimiento date,
  referencia text,
  status text NOT NULL DEFAULT 'pendiente',
  estado text NOT NULL DEFAULT 'pendiente',
  notas text,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  iva numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_cuentas_cobro_updated_at ON cuentas_cobro;
CREATE TRIGGER trg_cuentas_cobro_updated_at
BEFORE UPDATE ON cuentas_cobro
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_cuentas_cobro_cliente_id ON cuentas_cobro(cliente_id);

CREATE TABLE IF NOT EXISTS cuenta_cobro_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuenta_cobro_id uuid NOT NULL REFERENCES cuentas_cobro(id) ON DELETE CASCADE,
  concepto text NOT NULL,
  qty numeric(14,2) NOT NULL DEFAULT 1,
  precio numeric(14,2) NOT NULL DEFAULT 0,
  iva_pct numeric(6,2) NOT NULL DEFAULT 19
);

CREATE INDEX IF NOT EXISTS idx_cuenta_cobro_items_cuenta_id ON cuenta_cobro_items(cuenta_cobro_id);

DROP VIEW IF EXISTS cobros;
CREATE VIEW cobros AS
SELECT
  id,
  numero,
  cliente_id,
  fecha,
  fecha_vencimiento,
  referencia,
  status,
  estado,
  notas,
  subtotal,
  iva,
  total,
  created_at,
  updated_at
FROM cuentas_cobro;

-- =========================
-- PAGOS
-- =========================
CREATE TABLE IF NOT EXISTS pagos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cuenta_cobro_id uuid REFERENCES cuentas_cobro(id) ON DELETE SET NULL,
  cobro_id uuid REFERENCES cuentas_cobro(id) ON DELETE SET NULL,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  monto numeric(14,2) NOT NULL DEFAULT 0,
  valor numeric(14,2) NOT NULL DEFAULT 0,
  metodo text,
  referencia text,
  fecha date NOT NULL DEFAULT current_date,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_pagos_updated_at ON pagos;
CREATE TRIGGER trg_pagos_updated_at
BEFORE UPDATE ON pagos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_pagos_cuenta_cobro_id ON pagos(cuenta_cobro_id);
CREATE INDEX IF NOT EXISTS idx_pagos_cobro_id ON pagos(cobro_id);
CREATE INDEX IF NOT EXISTS idx_pagos_cliente_id ON pagos(cliente_id);

-- =========================
-- AUDITORÍA
-- =========================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE SET NULL,
  modulo text NOT NULL,
  accion text NOT NULL,
  entidad_id uuid,
  detalles jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_usuario_id ON audit_logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_modulo ON audit_logs(modulo);

-- =========================
-- DATOS SEMILLA
-- =========================
INSERT INTO empresa_config (nombre, nit, telefono, email, direccion, ciudad, website)
SELECT
  'Omnivision',
  '900000000-1',
  '3000000000',
  'admin@empresa.com',
  'Dirección principal',
  'Medellín',
  ''
WHERE NOT EXISTS (SELECT 1 FROM empresa_config);

INSERT INTO impuestos_config (iva_default, moneda)
SELECT 19, 'COP'
WHERE NOT EXISTS (SELECT 1 FROM impuestos_config);

INSERT INTO numeracion_config (
  cotizacion_prefix, orden_prefix, acta_prefix, cobro_prefix,
  cotizacion_seq, orden_seq, acta_seq, cobro_seq
)
SELECT 'COT', 'OT', 'ACT', 'CC', 0, 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM numeracion_config);

INSERT INTO categorias_producto (nombre, descripcion)
SELECT 'General', 'Categoría base'
WHERE NOT EXISTS (SELECT 1 FROM categorias_producto WHERE lower(nombre) = lower('General'));

INSERT INTO usuarios (nombre, email, password_hash, role, activo)
VALUES (
  'Administrador',
  'admin@empresa.com',
  crypt('admin123', gen_salt('bf')),
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE
SET
  nombre = EXCLUDED.nombre,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  activo = EXCLUDED.activo,
  updated_at = now();

-- =========================
-- RESUMEN FINAL
-- =========================
SELECT 'usuarios' AS tabla, COUNT(*) AS total FROM usuarios
UNION ALL
SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'productos', COUNT(*) FROM productos
UNION ALL
SELECT 'kits', COUNT(*) FROM kits
UNION ALL
SELECT 'cotizaciones', COUNT(*) FROM cotizaciones
UNION ALL
SELECT 'ordenes', COUNT(*) FROM ordenes
UNION ALL
SELECT 'actas', COUNT(*) FROM actas
UNION ALL
SELECT 'cuentas_cobro', COUNT(*) FROM cuentas_cobro
UNION ALL
SELECT 'pagos', COUNT(*) FROM pagos;
