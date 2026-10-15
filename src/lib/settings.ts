import "server-only";
import { prisma } from "./db";
import { SETTING_DEFAULTS, type Settings } from "./settings-config";

export * from "./settings-config";

export async function getSettings(): Promise<Settings> {
  const rows = await prisma.siteSetting.findMany();
  const result: Settings = { ...SETTING_DEFAULTS };
  for (const row of rows) {
    if (row.key in result) (result as Record<string, string>)[row.key] = row.value;
  }
  return result;
}
