// src/lib/db/client.ts
// Inicialización LAZY — la conexión se crea la primera vez que se usa,
// no cuando el módulo es importado. Esto evita FUNCTION_INVOCATION_FAILED
// en Vercel cuando DATABASE_URL no está definida o es inválida.

import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";

export { sql };

// ── Internos (singleton) ─────────────────────────────────────
let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function resolveDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL?.trim() ||
    (import.meta as any)?.env?.DATABASE_URL?.trim?.() ||
    "";
  if (!url) throw new Error("DATABASE_URL no está configurada en las variables de entorno.");
  return url;
}

function initClient(): ReturnType<typeof postgres> {
  if (_client) return _client;
  const url = resolveDatabaseUrl();
  _client = postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
  _db = drizzle(_client);
  return _client;
}

// ── API pública ──────────────────────────────────────────────

/** Obtiene el cliente postgres (lazy). Lanza si DATABASE_URL falta. */
export function getSqlClient(): ReturnType<typeof postgres> {
  return initClient();
}

/** Obtiene la instancia de Drizzle (lazy). Lanza si DATABASE_URL falta. */
export function getDb(): ReturnType<typeof drizzle> {
  initClient();
  return _db!;
}

/**
 * Compatibilidad con código antiguo que importa { sqlClient, db }.
 * Usar getSqlClient() / getDb() en código nuevo.
 * @deprecated Usar getSqlClient() o getDb()
 */
export const sqlClient = new Proxy({} as ReturnType<typeof postgres>, {
  get(_target, prop) {
    const client = initClient();
    const val = (client as any)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
  apply(_target, _this, args) {
    return (initClient() as any)(...args);
  },
});

/** @deprecated Usar getDb() */
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    initClient();
    return (_db as any)[prop];
  },
});

/** Verifica la conexión. Devuelve false en vez de lanzar. */
export async function testDbConnection(): Promise<boolean> {
  try {
    const client = getSqlClient();
    const result = await client`SELECT 1 AS ok`;
    return Array.isArray(result) && result.length > 0;
  } catch {
    return false;
  }
}