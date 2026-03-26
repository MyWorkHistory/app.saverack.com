/**
 * Demo users for client demos — run: npm run db:seed (from repo root)
 * Requires DATABASE_URL and applied migrations.
 *
 * All seeded accounts share the same demo password (see DEMO_PASSWORD below).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Shared password for every seeded user (change after demo if needed). */
const DEMO_PASSWORD = "SaveRack!Demo2025";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const adminRole = await prisma.role.upsert({
    where: { code: "ADMIN" },
    create: {
      code: "ADMIN",
      name: "Administrator",
      description: "Full CRM access",
    },
    update: {},
  });

  const userRole = await prisma.role.upsert({
    where: { code: "USER" },
    create: {
      code: "USER",
      name: "User",
      description: "Standard CRM access",
    },
    update: {},
  });

  const rows = [
    {
      email: "audi@saverack.net",
      fullName: "Audi Kowalski",
      roleId: adminRole.id,
      legacyRoleCode: 1,
    },
    {
      email: "morgan.blake@saverack.net",
      fullName: "Morgan Blake",
      roleId: userRole.id,
      legacyRoleCode: 2,
    },
    {
      email: "jamie.chen@saverack.net",
      fullName: "Jamie Chen",
      roleId: userRole.id,
      legacyRoleCode: 2,
    },
    {
      email: "devon.patel@saverack.net",
      fullName: "Devon Patel",
      roleId: adminRole.id,
      legacyRoleCode: 1,
    },
    {
      email: "sofia.rodriguez@saverack.net",
      fullName: "Sofia Rodriguez",
      roleId: userRole.id,
      legacyRoleCode: 2,
    },
  ];

  for (const row of rows) {
    const email = row.email.toLowerCase();
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        fullName: row.fullName,
        passwordHash,
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        legacyRoleCode: row.legacyRoleCode,
      },
      update: {
        fullName: row.fullName,
        passwordHash,
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        legacyRoleCode: row.legacyRoleCode,
      },
    });

    await prisma.userRole.deleteMany({ where: { userId: user.id } });
    await prisma.userRole.create({
      data: { userId: user.id, roleId: row.roleId },
    });
  }

  console.log(
    `Seeded ${rows.length} users (roles: ADMIN, USER). Demo password for all: ${DEMO_PASSWORD}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
