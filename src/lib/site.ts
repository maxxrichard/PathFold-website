/** The public origin of the site, without a trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://pathfold.de").replace(/\/+$/, "");
