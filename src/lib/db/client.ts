import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Falta DATABASE_URL en el .env");
}

const sql = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(sql);
export { sql };