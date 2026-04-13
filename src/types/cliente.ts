import type { AuditFields, ID } from "./common";

export type Cliente = AuditFields & {
  id: ID;
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  notas?: string;
  estado?: "activo" | "inactivo";
};
