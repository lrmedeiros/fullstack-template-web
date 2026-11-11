import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um servidor Node mínimo em .next/standalone para a imagem Docker.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
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
