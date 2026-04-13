import type { AuditFields, ID } from "./common";

export type Producto = AuditFields & {
  id: ID;
  nombre: string;
  categoria?: string;
  marca?: string;
  precio?: number;
  costo?: number;
  stock?: number;
  descripcion?: string;
  estado?: "activo" | "inactivo";
};
