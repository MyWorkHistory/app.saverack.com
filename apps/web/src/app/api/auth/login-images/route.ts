import { readdir } from "fs/promises";
import path from "path";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

const DIRS: { rel: string; urlBase: string }[] = [
  { rel: path.join("images", "login-images"), urlBase: "/images/login-images/" },
  {
    rel: path.join("assets", "images", "login-images"),
    urlBase: "/assets/images/login-images/",
  },
];

async function listLoginImages(
  rel: string,
  urlBase: string,
): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", rel);
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => IMAGE_EXT.test(f) && !f.startsWith("."))
      .map((f) => `${urlBase}${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

/**
 * Lists images in `public/images/login-images/` and `public/assets/images/login-images/`
 * (e.g. `1.png` … `4.png`) for random auth-panel backgrounds.
 */
export async function GET() {
  const merged: string[] = [];
  for (const { rel, urlBase } of DIRS) {
    merged.push(...(await listLoginImages(rel, urlBase)));
  }
  const paths = [...new Set(merged)].sort();
  return Response.json({ paths });
}
