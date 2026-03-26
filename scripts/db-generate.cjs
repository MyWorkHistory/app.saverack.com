"use strict";

/**
 * Run `prisma generate` without `npm run -w @crm/db`, so builds work when
 * the monorepo root has no node_modules (e.g. only apps/web was installed).
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function findRepoRoot() {
  let dir = path.resolve(__dirname, "..");
  while (true) {
    const schema = path.join(dir, "packages", "db", "prisma", "schema.prisma");
    if (fs.existsSync(schema)) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error(
    "db-generate: could not find packages/db/prisma/schema.prisma (run from monorepo checkout)"
  );
}

/** Load KEY=VALUE .env files; later files override earlier ones. */
function loadEnvFiles(root) {
  const files = [
    path.join(root, ".env"),
    path.join(root, ".env.local"),
    path.join(root, "apps", "web", ".env.local"),
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) {
      continue;
    }
    const text = fs.readFileSync(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const eq = trimmed.indexOf("=");
      if (eq <= 0) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

function resolvePrismaCli(root) {
  const searchRoots = [
    root,
    path.join(root, "apps", "web"),
    path.join(root, "packages", "db"),
  ];
  for (const s of searchRoots) {
    try {
      const pkgJson = require.resolve("prisma/package.json", { paths: [s] });
      const dir = path.dirname(pkgJson);
      const cli = path.join(dir, "build", "index.js");
      if (fs.existsSync(cli)) {
        return cli;
      }
    } catch (_) {
      /* continue */
    }
  }
  return null;
}

function main() {
  const root = findRepoRoot();
  loadEnvFiles(root);

  const schemaPath = path.join(root, "packages", "db", "prisma", "schema.prisma");
  const prismaCli = resolvePrismaCli(root);
  if (!prismaCli) {
    console.error(
      "db-generate: prisma CLI not found. Install dependencies from the repo root:\n" +
        "  npm install\n" +
        "or install the web app (includes prisma):\n" +
        "  cd apps/web && npm install"
    );
    process.exit(1);
  }

  const result = spawnSync(
    process.execPath,
    [prismaCli, "generate", "--schema", schemaPath],
    { cwd: root, stdio: "inherit", env: process.env }
  );
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

main();
