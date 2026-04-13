import type { AuditFields, ID } from "./common";

export type Orden = AuditFields & {
  id: ID;
  numero?: string;
  clienteId?: string;
  cotizacionId?: string;
  estado?: string;
  tecnico?: string;
  fecha?: string;
  notas?: string;
};
