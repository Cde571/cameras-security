import type { AuditFields, ID } from "./common";

export type Acta = AuditFields & {
  id: ID;
  numero?: string;
  ordenId?: string;
  clienteId?: string;
  fecha?: string;
  observaciones?: string;
  estado?: string;
};
