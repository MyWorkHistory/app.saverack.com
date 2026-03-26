import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

const CredentialsSchema = z.object({
  email: z.preprocess(
    (v) => (Array.isArray(v) ? v[0] : v),
    z.string().email(),
  ),
  password: z.preprocess(
    (v) => (Array.isArray(v) ? v[0] : v),
    z.string().min(1),
  ),
});

/** Local UI/design login — for localhost only, and can be disabled via `AUTH_DEV_BYPASS=false`. */
const DEV_DESIGN_EMAIL = "audi@saverack.com";
const DEV_DESIGN_PASSWORD = "J0rdan$123";

function isDevDesignBypass(
  email: string,
  password: string,
): boolean {
  // This bypass is meant for local UI/design work only.
  // Gate it by being on localhost (via NEXTAUTH_URL) and allow disabling via AUTH_DEV_BYPASS.
  const nextAuthUrl = (process.env.NEXTAUTH_URL ?? "").toLowerCase();
  const isLocalhost = nextAuthUrl.includes("localhost") || nextAuthUrl.includes("127.0.0.1");
  if (!isLocalhost) return false;
  if (process.env.AUTH_DEV_BYPASS === "false") return false;
  return (
    email === DEV_DESIGN_EMAIL.toLowerCase() && password === DEV_DESIGN_PASSWORD
  );
}

/** Required for JWT signing. Without it, NextAuth shows `error=Configuration`. */
const nextAuthSecret =
  process.env.NEXTAUTH_SECRET ||
  // Local fallback to prevent `error=Configuration` / `NO_SECRET` during design work.
  // In real deployments, always set `NEXTAUTH_SECRET` via environment variables.
  "local-dev-only-nextauth-secret-do-not-use-in-production-min-32-chars";

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    /** Avoid NextAuth’s built-in `/api/auth/error` HTML path (can 500 on App Router). Show errors on login instead. */
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = CredentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();

        const bypass = isDevDesignBypass(email, parsed.data.password);

        if (bypass) {
          return {
            id: "dev-design-user",
            name: "Audi",
            email: DEV_DESIGN_EMAIL,
          };
        }

        // Lazy-load prisma so design-only login works even without DATABASE_URL.
        const { prisma } = await import("@crm/db");
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        if (user.status !== "ACTIVE") return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.fullName ?? user.email,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).user.id = token.sub;
      }
      return session;
    },
  },
};

