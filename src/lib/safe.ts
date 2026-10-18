import "server-only";

let warned = false;

/**
 * Runs a database query and falls back to a default value when the database is
 * unavailable or not yet migrated, so public pages still render instead of
 * failing with a 500. The error is logged once per process.
 */
export async function safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (e) {
    if (!warned) {
      warned = true;
      const message = e instanceof Error ? e.message.split("\n").slice(-2).join(" ") : String(e);
      console.error(`[pathfold] database unavailable, rendering fallbacks. Visit /api/health for details. ${message}`);
    }
    return fallback;
  }
}
