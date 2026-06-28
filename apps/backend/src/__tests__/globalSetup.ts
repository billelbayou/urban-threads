import { execSync } from "child_process";
import { readFileSync } from "fs";
import { parse } from "dotenv";

export async function setup() {
  const envRaw = readFileSync(".env.test", "utf-8");
  const testEnv = parse(envRaw);

  console.log("\nPushing Prisma schema to test database...");
  execSync("npx prisma db push --force-reset --accept-data-loss", {
    stdio: "inherit",
    env: { ...process.env, ...testEnv },
  });
  console.log("Test database is ready\n");
}

export async function teardown() {}
