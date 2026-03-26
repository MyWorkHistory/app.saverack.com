import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@crm/db";
import { generateResetToken, hashResetToken } from "@/lib/passwordReset";

const BodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return OK to avoid user enumeration.
  if (!user) return NextResponse.json({ ok: true });

  const token = generateResetToken();
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  // TODO: integrate real email provider.
  // For dev convenience, we return the token only outside production.
  const debugToken =
    process.env.NODE_ENV === "production" ? undefined : token;

  return NextResponse.json({ ok: true, debugToken });
}

