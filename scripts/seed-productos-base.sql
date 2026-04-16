CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categorias_producto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categorías base
INSERT INTO categorias_producto (nombre)
VALUES
  ('Cámaras IP'),
  ('Cámaras Análogas'),
  ('DVR'),
  ('NVR'),
  ('Discos Duros'),
  ('Fuentes de Poder'),
  ('Cableado'),
  ('Accesorios'),
  ('Kits'),
  ('Control de Acceso'),
  ('Videoporteros'),
  ('Alarmas'),
  ('Redes'),
  ('Monitores'),
  ('Soportes'),
  ('Sensores'),
  ('UPS'),
  ('Instalación y Configuración')
ON CONFLICT (nombre) DO NOTHING;

-- Si existen productos sin categoría, poner categoría por defecto
UPDATE productos
SET categoria = 'Accesorios'
WHERE categoria IS NULL OR trim(categoria) = '';

-- Insertar productos base mínimos si no hay productos
INSERT INTO productos (
  nombre, codigo, sku, descripcion, categoria, marca, unidad,
  costo, precio, iva_pct, stock, activo, estado, created_at, updated_at
)
SELECT *
FROM (
  VALUES
    ('Cámara IP 2MP', 'CAM-IP-2MP', 'SKU-CAMIP2', 'Cámara IP tipo domo 2MP', 'Cámaras IP', 'Hikvision', 'unidad', 120000, 175000, 19, 10, true, 'activo', now(), now()),
    ('Cámara IP 4MP', 'CAM-IP-4MP', 'SKU-CAMIP4', 'Cámara IP tipo bala 4MP', 'Cámaras IP', 'Dahua', 'unidad', 180000, 245000, 19, 8, true, 'activo', now(), now()),
    ('DVR 8 Canales', 'DVR-8CH', 'SKU-DVR8', 'DVR 8 canales H.265', 'DVR', 'Hikvision', 'unidad', 260000, 340000, 19, 5, true, 'activo', now(), now()),
    ('NVR 8 Canales', 'NVR-8CH', 'SKU-NVR8', 'NVR 8 canales PoE', 'NVR', 'Dahua', 'unidad', 320000, 420000, 19, 4, true, 'activo', now(), now()),
    ('Disco Duro 1TB', 'HDD-1TB', 'SKU-HDD1', 'Disco duro para videovigilancia 1TB', 'Discos Duros', 'Western Digital', 'unidad', 165000, 220000, 19, 6, true, 'activo', now(), now()),
    ('Fuente 12V 10A', 'FTE-12V10A', 'SKU-FTE10A', 'Fuente regulada 12V 10A', 'Fuentes de Poder', 'Genérica', 'unidad', 45000, 70000, 19, 12, true, 'activo', now(), now()),
    ('Cable UTP Cat6', 'UTP-CAT6', 'SKU-UTP6', 'Cable UTP categoría 6', 'Cableado', 'Argom', 'metro', 1800, 3200, 19, 500, true, 'activo', now(), now()),
    ('Balun Pasivo', 'BAL-PAS', 'SKU-BALUN', 'Balun pasivo para video', 'Accesorios', 'Genérica', 'unidad', 6000, 12000, 19, 30, true, 'activo', now(), now()),
    ('Switch 8 Puertos', 'SWT-8P', 'SKU-SW8', 'Switch 8 puertos 10/100', 'Redes', 'TP-Link', 'unidad', 65000, 98000, 19, 7, true, 'activo', now(), now()),
    ('Monitor 22"', 'MON-22', 'SKU-MON22', 'Monitor LED 22 pulgadas', 'Monitores', 'LG', 'unidad', 290000, 390000, 19, 3, true, 'activo', now(), now())
) AS seed(
  nombre, codigo, sku, descripcion, categoria, marca, unidad,
  costo, precio, iva_pct, stock, activo, estado, created_at, updated_at
)
WHERE NOT EXISTS (SELECT 1 FROM productos);

SELECT 'categorias_producto' AS tabla, count(*) AS total FROM categorias_producto
UNION ALL
SELECT 'productos' AS tabla, count(*) AS total FROM productos;