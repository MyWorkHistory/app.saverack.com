import { existsSync } from "fs";
import nextEnv from "@next/env";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const { loadEnvConfig } = nextEnv;

const cwd = process.cwd();
const thisDir = path.dirname(fileURLToPath(import.meta.url));

// Load env files from:
// - current working directory (usually `apps/web` when using workspaces)
// - this package directory (stable even if invoked from repo root)
// - monorepo root (two levels up from `apps/web`)
const envDirs = Array.from(
  new Set([cwd, thisDir, path.resolve(thisDir, "..", "..")]),
);

for (const dir of envDirs) {
  if (existsSync(path.join(dir, "package.json")) || existsSync(path.join(dir, ".env"))) {
    loadEnvConfig(dir);
  }
}

const require = createRequire(import.meta.url);

// Node 14: global AbortController is missing; next/font/google and some loaders need it at build time.
if (typeof globalThis.AbortController === "undefined") {
  const { AbortController } = require("abort-controller");
  globalThis.AbortController = AbortController;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    // Prisma must run from node_modules; bundling it breaks schema.prisma resolution during `next build` (collecting page data).
    serverComponentsExternalPackages: ["@prisma/client", "@crm/db", "prisma"],
  },
  transpilePackages: ["@crm/db"],
  webpack(config, { isServer }) {
    const svgr = require.resolve("@svgr/webpack");

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [svgr],
    });

    if (isServer) {
      config.externals.push("@prisma/client", "prisma");
    }

    return config;
  },
};

export default nextConfig;
