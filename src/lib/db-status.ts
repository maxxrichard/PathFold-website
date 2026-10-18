import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "./db";

export interface DbStatus {
  /** DATABASE_URL is present */
  configured: boolean;
  /** a connection could be established */
  connected: boolean;
  /** the tables from prisma/schema.prisma exist */
  migrated: boolean;
  /** an admin user exists (first login via ADMIN_EMAIL/ADMIN_PASSWORD still works without one) */
  hasAdmin: boolean;
  /** AUTH_SECRET is set and long enough */
  authSecret: boolean;
  error?: string;
  hint?: string;
}

/** Human-readable classification of a Prisma error. Never includes credentials. */
export function describeDbError(e: unknown): { error: string; hint: string } {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2021" || e.code === "P2022") {
      return {
        error: `Database schema missing (${e.code}).`,
        hint: "Create the tables: run `npx prisma db push` against the production DATABASE_URL, or set PRISMA_DB_PUSH_ON_BUILD=1 in Vercel and redeploy.",
      };
    }
    return { error: `Database error ${e.code}.`, hint: e.message.split("\n").slice(-1)[0] ?? "" };
  }
  if (e instanceof Prisma.PrismaClientInitializationError) {
    return {
      error: "Cannot connect to the database.",
      hint: "Check DATABASE_URL in the Vercel project settings (Storage → connect a Postgres database). For pooled URLs append ?pgbouncer=true&connection_limit=1.",
    };
  }
  const message = e instanceof Error ? e.message : String(e);
  if (/prepared statement/i.test(message)) {
    return { error: "Connection pooler conflict.", hint: "Append ?pgbouncer=true&connection_limit=1 to DATABASE_URL." };
  }
  return { error: message.split("\n").slice(-1)[0] || "Unknown database error", hint: "" };
}

export async function checkDatabase(): Promise<DbStatus> {
  const status: DbStatus = {
    configured: Boolean(process.env.DATABASE_URL),
    connected: false,
    migrated: false,
    hasAdmin: false,
    authSecret: (process.env.AUTH_SECRET?.length ?? 0) >= 16,
  };
  if (!status.configured) {
    status.error = "DATABASE_URL is not set.";
    status.hint = "Add a Postgres database to the Vercel project (Storage tab) or set DATABASE_URL manually, then redeploy.";
    return status;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    status.connected = true;
  } catch (e) {
    Object.assign(status, describeDbError(e));
    return status;
  }
  try {
    status.hasAdmin = (await prisma.adminUser.count()) > 0;
    await prisma.siteSetting.count();
    status.migrated = true;
  } catch (e) {
    Object.assign(status, describeDbError(e));
  }
  return status;
}
