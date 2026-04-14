import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
export { sql } from 'drizzle-orm';
import postgres from 'postgres';

function resolveDatabaseUrl() {
  const fromProcess = process.env.DATABASE_URL?.trim();
  if (fromProcess) return fromProcess;
  try {
    const fromImportMeta = import.meta?.env?.DATABASE_URL?.trim?.() || import.meta?.env?.PUBLIC_DATABASE_URL?.trim?.();
    if (fromImportMeta) return fromImportMeta;
  } catch {
  }
  throw new Error("Falta DATABASE_URL en el entorno");
}
const DATABASE_URL = resolveDatabaseUrl();
const sqlClient = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false
});
const db = drizzle(sqlClient);
async function testDbConnection() {
  const result = await sqlClient`select 1 as ok`;
  return Array.isArray(result) && result.length > 0;
}

export { DATABASE_URL, db, sqlClient, testDbConnection };
