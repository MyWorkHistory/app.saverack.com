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

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@crm/db"],
  webpack(config) {
    const svgr = require.resolve("@svgr/webpack");

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [svgr],
    });

    return config;
  },
};

export default nextConfig;
