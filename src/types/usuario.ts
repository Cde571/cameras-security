import type { AuditFields, ID } from "./common";

export type Usuario = AuditFields & {
  id: ID;
  name: string;
  email: string;
  role: "admin" | "user";
  active?: boolean;
};
