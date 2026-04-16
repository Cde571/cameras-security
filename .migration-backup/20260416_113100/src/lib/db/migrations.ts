import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, sql } from "./client";

export async function runMigrations() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(async () => {
      console.log("✅ Migraciones aplicadas");
      await sql.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error migrando:", err);
      await sql.end();
      process.exit(1);
    });
}