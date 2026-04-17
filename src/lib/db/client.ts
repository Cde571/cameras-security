import { config } from "dotenv";
config();
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";

export { sql };

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim() || "";
  if (!url) {
    throw new Error("Falta DATABASE_URL en el entorno");
  }
  return url;
}

export function getSqlClient() {
  if (_client) return _client;

  _client = postgres(resolveDatabaseUrl(), {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

  return _client;
}

export function getDb() {
  if (_db) return _db;
  _db = drizzle(getSqlClient());
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

export async function testDbConnection() {
  try {
    const result = await getSqlClient()`select 1 as ok`;
    return Array.isArray(result) && result.length > 0;
  } catch {
    return false;
  }
}