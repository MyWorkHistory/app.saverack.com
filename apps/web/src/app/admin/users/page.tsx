import { UsersClientTable } from "@/components/admin/UsersClientTable";
import type { UserRowDTO } from "@/components/admin/UsersClientTable";
import { prisma } from "@crm/db";
import type { Prisma } from "@prisma/client";
import type { Metadata } from "next";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Users",
};

export const dynamic = "force-dynamic";

const SortKeySchema = z.enum([
  "name",
  "email",
  "status",
  "role",
  "lastLogin",
  "created",
]);
const OrderSchema = z.enum(["asc", "desc"]);
const PageSizeSchema = z.coerce
  .number()
  .refine((n) => [5, 10, 15, 20].includes(n));

type SortKey = z.infer<typeof SortKeySchema>;

function orderByFor(
  sort: SortKey,
  order: "asc" | "desc",
): Prisma.UserOrderByWithRelationInput {
  const dir = order;
  switch (sort) {
    case "name":
      return { fullName: dir };
    case "email":
      return { email: dir };
    case "status":
      return { status: dir };
    case "role":
      return { legacyRoleCode: dir };
    case "lastLogin":
      return { lastLoginAt: dir };
    case "created":
    default:
      return { createdAt: dir };
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  try {
    return await AdminUsersPageInner(await searchParams);
  } catch (e) {
    console.error("[admin/users]", e);
    return (
      <>
        <div className="mb-6">
          <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
            Users
          </h1>
          <p className="mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            Could not load users. Check that MySQL is running and{" "}
            <code className="rounded bg-red-100 px-1 dark:bg-red-950/50">
              DATABASE_URL
            </code>{" "}
            in{" "}
            <code className="rounded bg-red-100 px-1 dark:bg-red-950/50">
              apps/web/.env.local
            </code>{" "}
            is correct, then run{" "}
            <code className="rounded bg-red-100 px-1 dark:bg-red-950/50">
              npm run db:migrate
            </code>
            .
          </p>
        </div>
      </>
    );
  }
}

async function AdminUsersPageInner(sp: Record<string, string | string[] | undefined>) {

  const ParamsSchema = z.object({
    q: z.string().trim().min(1).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: PageSizeSchema.default(10),
    sort: SortKeySchema.default("created"),
    order: OrderSchema.default("desc"),
  });

  const parsed = ParamsSchema.safeParse({
    q: typeof sp.q === "string" ? sp.q : undefined,
    page: typeof sp.page === "string" ? sp.page : "1",
    pageSize: typeof sp.pageSize === "string" ? sp.pageSize : "10",
    sort: typeof sp.sort === "string" ? sp.sort : "created",
    order: typeof sp.order === "string" ? sp.order : "desc",
  });

  const q = parsed.success ? parsed.data.q : undefined;
  const page = parsed.success ? parsed.data.page : 1;
  const pageSize = parsed.success ? parsed.data.pageSize : 10;
  const sort = parsed.success ? parsed.data.sort : "created";
  const order = parsed.success ? parsed.data.order : "desc";

  const where = q
    ? {
        OR: [
          { email: { contains: q } },
          { fullName: { contains: q } },
        ],
      }
    : undefined;

  const orderBy = orderByFor(sort, order);

  const [total, usersRaw] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: { name: true, code: true },
            },
          },
        },
      },
    }),
  ]);

  const users: UserRowDTO[] = usersRaw.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    status: u.status,
    roleNames:
      u.roles.length === 0
        ? ""
        : u.roles.map((r) => r.role.name).join(", "),
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
  }));

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="mb-6">
        <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
          Users
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage CRM users and roles.
        </p>
      </div>

      <UsersClientTable
        users={users}
        total={total}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        q={q}
        sort={sort}
        order={order}
      />
    </>
  );
}

