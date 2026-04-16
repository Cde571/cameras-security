export type ProductoBase = {
  id: string;
  nombre: string;
  codigo?: string;
  sku?: string;
  descripcion?: string;
  categoria?: string;
  unidad?: string;
  costo?: number;
  precio?: number;
  iva?: number;
  stock?: number;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type KitItem = {
  id?: string;
  productoId: string;
  nombre: string;
  cantidad: number;
  costoUnitario: number;
  precioUnitario: number;
};

export type KitBase = {
  id: string;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
  items: KitItem[];
  costoTotal: number;
  precioTotal: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductoDuplicadoResult = {
  ok: boolean;
  duplicated: boolean;
  matches: Array<{
    id: string;
    nombre: string;
    codigo?: string;
    sku?: string;
  }>;
};
