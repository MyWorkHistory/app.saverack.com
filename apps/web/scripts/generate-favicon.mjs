/**
 * Builds favicon assets from the SaveRack logo (public/assets/images/logo.jpg).
 * Run: npm run favicon -w @crm/web
 */
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");
const LOGO = join(APP_ROOT, "public", "assets", "images", "logo.jpg");

async function pngSquare(size) {
  return sharp(LOGO)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();
}

async function main() {
  if (!existsSync(LOGO)) {
    console.error("Missing logo file:", LOGO);
    process.exit(1);
  }

  const [buf16, buf32, buf48] = await Promise.all([
    pngSquare(16),
    pngSquare(32),
    pngSquare(48),
  ]);

  const ico = await toIco([buf16, buf32, buf48]);
  writeFileSync(join(APP_ROOT, "public", "favicon.ico"), ico);

  writeFileSync(join(APP_ROOT, "src", "app", "icon.png"), buf32);

  const apple = await sharp(LOGO)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();
  writeFileSync(join(APP_ROOT, "src", "app", "apple-icon.png"), apple);

  console.log("Favicon generated: public/favicon.ico, src/app/icon.png, src/app/apple-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
