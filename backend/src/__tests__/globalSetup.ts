import { execSync } from "child_process";
import dotenv from "dotenv";
import path from "path";

export async function setup() {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env.test"),
    override: true,
  });

  console.log("\nPushing Prisma schema to test database...");
  execSync("npx prisma db push --force-reset --accept-data-loss", {
    stdio: "inherit",
    env: { ...process.env },
  });
  console.log("Test database is ready\n");
}

export async function teardown() {}
