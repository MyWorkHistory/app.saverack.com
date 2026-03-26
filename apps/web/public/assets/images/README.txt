Files copied from your live site (saverack.net) into this repo:

  assets/images/logo.jpg              — from https://saverack.net/images/pdf/logo.jpg (Save Rack mark; used if logo.png is missing)
  assets/images/login-images/login-frent-img.jpg
  assets/images/icons/forgot-2.png

  images/small-logo.jpg               — tab icon (same as old CRM favicon URL host)

Optional override: place Laravel public/assets/images/logo.png here — SiteLogo tries .png first, then logo.jpg, then TailAdmin SVG.

To refresh from production later, run from repo root:
  node scripts/fetch-saverack-assets.mjs
