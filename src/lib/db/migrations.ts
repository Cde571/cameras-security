import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, getSqlClient } from "./client";

export async function runMigrations() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const client = getSqlClient();

  runMigrations()
    .then(async () => {
      console.log("✅ Migraciones aplicadas");
      await client.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error migrando:", err);
      await client.end();
      process.exit(1);
    });
}