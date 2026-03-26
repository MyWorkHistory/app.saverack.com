import { authOptions } from "@/lib/auth";
import { prisma } from "@crm/db";
import { UserStatus } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { z } from "zod";

const PatchSchema = z.object({
  fullName: z.string().trim().max(200).optional().nullable(),
  status: z.nativeEnum(UserStatus).optional(),
});

export async function PATCH(
  req: Request,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const data = parsed.data;
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PATCH /api/admin/users/:id]", e);
    return NextResponse.json(
      { error: "Server error updating user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    const sessionUserId = (session.user as { id?: string }).id;
    if (sessionUserId && sessionUserId === id) {
      return NextResponse.json(
        { error: "You cannot delete your own account from here." },
        { status: 400 },
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[DELETE /api/admin/users/:id]", e);
    return NextResponse.json(
      { error: "Server error deleting user" },
      { status: 500 },
    );
  }
}
