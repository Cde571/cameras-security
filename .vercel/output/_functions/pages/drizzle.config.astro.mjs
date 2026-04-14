import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export { renderers } from '../renderers.mjs';

const drizzle_config = defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: drizzle_config
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
