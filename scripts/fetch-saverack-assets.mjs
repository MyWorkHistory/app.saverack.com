/**
 * Re-download public marketing assets from saverack.net (same paths as old Laravel public/).
 * Run: node scripts/fetch-saverack-assets.mjs
 */
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const webPublic = join(root, "apps", "web", "public");

const files = [
  {
    url: "https://saverack.net/images/pdf/logo.jpg",
    out: "assets/images/logo.jpg",
  },
  {
    url: "https://saverack.net/assets/images/login-images/login-frent-img.jpg",
    out: "assets/images/login-images/login-frent-img.jpg",
  },
  {
    url: "https://saverack.net/assets/images/icons/forgot-2.png",
    out: "assets/images/icons/forgot-2.png",
  },
  {
    url: "https://saverack.net/images/small-logo.jpg",
    out: "images/small-logo.jpg",
  },
];

for (const { url, out } of files) {
  const dest = join(webPublic, out);
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log("OK", out, buf.length, "bytes");
}
