import type { AuditFields, ID } from "./common";
import type { Cliente } from "./cliente";

export type CotizacionItem = {
  id: ID;
  kind: "producto" | "kit" | "servicio";
  nombre: string;
  unidad?: string;
  qty: number;
  precio: number;
  ivaPct: number;
};

export type Cotizacion = AuditFields & {
  id: ID;
  numero: string;
  version: number;
  parentId?: string;
  fecha: string;
  vigenciaDias: number;
  status: "borrador" | "enviada" | "aceptada" | "rechazada" | "vencida";
  clienteId: string;
  cliente: Pick<Cliente, "id" | "nombre" | "documento" | "telefono" | "email" | "direccion" | "ciudad">;
  asunto?: string;
  condiciones?: string;
  notas?: string;
  items: CotizacionItem[];
};
