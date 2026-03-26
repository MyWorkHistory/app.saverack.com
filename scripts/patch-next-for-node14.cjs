"use strict";

/**
 * Next.js 13.3.x throws at config load if experimental.appDir is true and Node < 16.8.
 * This project targets Node 14.18+; the guard is overly strict for our stack.
 * Idempotent: safe to run after every npm install / before build.
 */
const fs = require("fs");
const path = require("path");

const MARKER = "next-appdir-node14-patched";

const NEEDLE = `                        if (!isAboveNodejs16) {
                            throw new Error(\`experimental.appDir requires Node v\${NODE_16_VERSION} or later.\`);
                        }
`;

const REPLACEMENT = `                        // ${MARKER}: allow experimental.appDir on Node 14 (scripts/patch-next-for-node14.cjs)
`;

function candidatePaths() {
  const repoRoot = path.join(__dirname, "..");
  return [
    path.join(repoRoot, "node_modules", "next", "dist", "server", "config.js"),
    path.join(repoRoot, "apps", "web", "node_modules", "next", "dist", "server", "config.js"),
  ].filter((p) => fs.existsSync(p));
}

function patchFile(filePath) {
  let s = fs.readFileSync(filePath, "utf8");
  if (s.includes(MARKER)) {
    return false;
  }
  if (!s.includes(NEEDLE)) {
    return false;
  }
  s = s.replace(NEEDLE, REPLACEMENT);
  fs.writeFileSync(filePath, s, "utf8");
  return true;
}

let n = 0;
for (const p of candidatePaths()) {
  if (patchFile(p)) {
    n += 1;
    console.log("[patch-next-for-node14] patched:", p);
  }
}

if (n === 0 && candidatePaths().length === 0) {
  console.warn(
    "[patch-next-for-node14] next/dist/server/config.js not found (run npm install from repo root?)"
  );
}
