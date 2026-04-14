import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";

function resolveDatabaseUrl() {
  const fromProcess = process.env.DATABASE_URL?.trim();
  if (fromProcess) return fromProcess;

  try {
    const fromImportMeta =
      (import.meta as any)?.env?.DATABASE_URL?.trim?.() ||
      (import.meta as any)?.env?.PUBLIC_DATABASE_URL?.trim?.();
    if (fromImportMeta) return fromImportMeta;
  } catch {
    // no-op
  }

  throw new Error("Falta DATABASE_URL en el entorno");
}

export const DATABASE_URL = resolveDatabaseUrl();

export const sqlClient = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

export const db = drizzle(sqlClient);
export { sql };

export async function testDbConnection() {
  const result = await sqlClient`select 1 as ok`;
  return Array.isArray(result) && result.length > 0;
}
