import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site reads from the database at request time (see `dynamic = "force-dynamic"` in the root layout),
  // so the Cache Components model is not used.
  cacheComponents: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
