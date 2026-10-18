// Runs `prisma db push` during the build when PRISMA_DB_PUSH_ON_BUILD=1 is set.
// Lets a fresh Vercel deployment create its tables without local tooling.
import { spawnSync } from "node:child_process";

const enabled = ["1", "true", "yes"].includes(String(process.env.PRISMA_DB_PUSH_ON_BUILD ?? "").toLowerCase());

if (!enabled) {
  console.log("[db-push-on-build] skipped (set PRISMA_DB_PUSH_ON_BUILD=1 to apply the schema during the build)");
  process.exit(0);
}
if (!process.env.DATABASE_URL) {
  console.error("[db-push-on-build] PRISMA_DB_PUSH_ON_BUILD is set but DATABASE_URL is missing");
  process.exit(1);
}

console.log("[db-push-on-build] applying prisma/schema.prisma to the database …");
const result = spawnSync("npx", ["prisma", "db", "push", "--skip-generate"], { stdio: "inherit", env: process.env });
process.exit(result.status ?? 1);
