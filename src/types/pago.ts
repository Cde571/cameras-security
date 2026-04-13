import type { AuditFields, ID } from "./common";

export type Pago = AuditFields & {
  id: ID;
  cuentaId?: string;
  clienteId?: string;
  fecha?: string;
  valor?: number;
  metodo?: string;
  soporte?: string;
};
