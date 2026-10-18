import { NextResponse } from "next/server";
import { checkDatabase } from "@/lib/db-status";

/**
 * Deployment health check: GET /api/health
 * Reports whether the database is configured, reachable and migrated.
 * Contains no secrets, so it is safe to open in a browser.
 */
export async function GET() {
  const db = await checkDatabase();
  const ok = db.configured && db.connected && db.migrated && db.authSecret;
  return NextResponse.json(
    {
      ok,
      database: db,
      environment: {
        vercel: Boolean(process.env.VERCEL),
        nodeEnv: process.env.NODE_ENV,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
        blobUploads: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        adminBootstrap: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD),
      },
    },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
