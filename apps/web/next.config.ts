import { existsSync } from "fs";
import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import { createRequire } from "module";
import path from "path";

const cwd = process.cwd();
loadEnvConfig(cwd);
const webAppDir = path.join(cwd, "apps", "web");
if (existsSync(path.join(webAppDir, "package.json"))) {
  loadEnvConfig(webAppDir);
}

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
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
