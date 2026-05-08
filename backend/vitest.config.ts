import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    env: {
      DATABASE_URL: process.env.DATABASE_URL!,
      DIRECT_URL: process.env.DIRECT_URL!,
      JWT_SECRET: process.env.JWT_SECRET!,
      FRONTEND_URL: process.env.FRONTEND_URL!,
      PORT: process.env.PORT!,
      NODE_ENV: process.env.NODE_ENV!,
      COOKIE_EXPIRES_IN: process.env.COOKIE_EXPIRES_IN!,
      BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS!,
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!,
      SUPABASE_BUCKET_NAME: process.env.SUPABASE_BUCKET_NAME!,
      SUPABASE_REGION: process.env.SUPABASE_REGION!,
      SUPABASE_ACCESS_KEY_ID: process.env.SUPABASE_ACCESS_KEY_ID!,
      SUPABASE_SECRET_ACCESS_KEY: process.env.SUPABASE_SECRET_ACCESS_KEY!,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
      ADMIN_FIRST_NAME: process.env.ADMIN_FIRST_NAME!,
      ADMIN_LAST_NAME: process.env.ADMIN_LAST_NAME!,
    },
    globalSetup: ["./src/__tests__/globalSetup.ts"],
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/__tests__/**/*.test.ts"],
  },
});
