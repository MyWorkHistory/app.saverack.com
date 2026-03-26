# Environment: local vs production

Next.js loads env files in this order (later wins):

1. `.env`
2. `.env.local` (ignored by git — put secrets here locally)
3. `.env.development` or `.env.production` (based on `NODE_ENV`)
4. `.env.development.local` or `.env.production.local`

## Local development

1. Copy [`.env.development.example`](../.env.development.example) to **`.env.local`** in the project root (same folder as `package.json`).
2. Adjust `DATABASE_URL` to your local MySQL database. If `root` has **no password**, use `mysql://root@localhost:3306/your_db` (omit `:password`).
3. Run `npm run dev` — `NODE_ENV` is `development` automatically.

Using **separate databases** for dev vs prod avoids accidents (`saverack_net` locally vs production DB).

## Production (cPanel / VPS)

1. Set the same variable **names** as in [`.env.production.example`](../.env.production.example) in your host’s environment UI, **or** upload a `.env.production.local` on the server only (never commit it).
2. Use a **new** `NEXTAUTH_SECRET` for production (do not reuse dev).
3. Set `NEXTAUTH_URL` to your real HTTPS URL.

## Prisma / migrations

`DATABASE_URL` is read when you run `npm run db:migrate` or `db:generate`. Use the URL that matches the environment you are migrating (local DB for dev, server DB only when you intentionally migrate production).

Prisma runs from `packages/db`, so it does **not** automatically load `apps/web/.env.local`. The `@crm/db` scripts use `dotenv-cli` to load, in order: root `.env`, root `.env.local`, then `apps/web/.env.local` (later files override). Put `DATABASE_URL` in `apps/web/.env.local` (recommended) or root `.env.local`.

The Next.js app (`apps/web/next.config.ts`) calls **`loadEnvConfig`** for `process.cwd()` and, when you run commands from the **monorepo root**, also for `apps/web`, so `DATABASE_URL` is available to server components and Prisma in both cases.

### Demo users (seed)

After migrations, run **`npm run db:seed`** from the repo root. This upserts `ADMIN` / `USER` roles and five demo users (including `audi@saverack.net`). The shared demo password is printed in the seed script output (`packages/db/prisma/seed.mjs`). Re-run seed after changing the password in that file if you need to reset hashes.
