import type { AuditFields, ID } from "./common";

export type CuentaCobro = AuditFields & {
  id: ID;
  numero?: string;
  clienteId?: string;
  fecha?: string;
  estado?: string;
  subtotal?: number;
  iva?: number;
  total?: number;
};
