"use client";

import { UserEditForm } from "@/components/admin/UserEditForm";
import { Modal } from "@/components/ui/modal/Modal";
import { formatDateOnly } from "@/lib/date";
import { ChevronDownIcon } from "@/icons";
import type { UserStatus } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export type UserRowDTO = {
  id: string;
  fullName: string | null;
  email: string;
  status: UserStatus;
  roleNames: string;
  lastLoginAt: string | null;
  createdAt: string;
};

type SortKey = "name" | "email" | "status" | "role" | "lastLogin" | "created";

function buildUsersUrl(opts: {
  q?: string;
  page: number;
  pageSize: number;
  sort: SortKey;
  order: "asc" | "desc";
}) {
  const p = new URLSearchParams();
  if (opts.q) p.set("q", opts.q);
  p.set("page", String(opts.page));
  p.set("pageSize", String(opts.pageSize));
  p.set("sort", opts.sort);
  p.set("order", opts.order);
  return `/admin/users?${p.toString()}`;
}

function SortTh({
  label,
  sortKey,
  currentSort,
  currentOrder,
  q,
  pageSize,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  currentOrder: "asc" | "desc";
  q?: string;
  pageSize: number;
}) {
  const nextOrder =
    currentSort === sortKey ? (currentOrder === "asc" ? "desc" : "asc") : "asc";
  const href = buildUsersUrl({
    q,
    page: 1,
    pageSize,
    sort: sortKey,
    order: nextOrder,
  });
  const active = currentSort === sortKey;
  return (
    <th className="px-5 py-3">
      <Link
        href={href}
        className={twMerge(
          "inline-flex items-center gap-1 font-semibold hover:text-brand-600 dark:hover:text-brand-400",
          active ? "text-brand-600 dark:text-brand-400" : "",
        )}
      >
        {label}
        {active ? (
          <span className="text-xs" aria-hidden>
            {currentOrder === "asc" ? "↑" : "↓"}
          </span>
        ) : (
          <span className="text-[10px] opacity-40" aria-hidden>
            ⇅
          </span>
        )}
      </Link>
    </th>
  );
}

function ManageDropdown({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative inline-flex justify-end" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Manage
        <ChevronDownIcon className="size-4 text-gray-500" />
      </button>
      {open ? (
        <div
          className="absolute right-0 z-50 mt-1 min-w-[10.5rem] rounded-xl border border-gray-200 bg-white py-1 shadow-theme-md dark:border-gray-700 dark:bg-gray-900"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  users: UserRowDTO[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  q?: string;
  sort: SortKey;
  order: "asc" | "desc";
};

export function UsersClientTable({
  users,
  total,
  page,
  pageSize,
  pageCount,
  q,
  sort,
  order,
}: Props) {
  const router = useRouter();
  const [editUser, setEditUser] = useState<UserRowDTO | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRowDTO | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deleteUser) return;
    setDeleteError(null);
    setDeletePending(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setDeleteError(data.error ?? "Delete failed");
        return;
      }
      setDeleteUser(null);
      router.refresh();
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white/90">
              User list
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {total} total • page {page} / {pageCount}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <form
              method="get"
              action="/admin/users"
              className="flex items-center gap-2"
            >
              {q ? <input type="hidden" name="q" value={q} /> : null}
              <input type="hidden" name="sort" value={sort} />
              <input type="hidden" name="order" value={order} />
              <input type="hidden" name="page" value="1" />
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Rows per page
              </label>
              <select
                name="pageSize"
                defaultValue={String(pageSize)}
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </form>
            <form className="flex flex-wrap items-center gap-2" action="/admin/users">
              <input type="hidden" name="pageSize" value={String(pageSize)} />
              <input type="hidden" name="sort" value={sort} />
              <input type="hidden" name="order" value={order} />
              <input type="hidden" name="page" value="1" />
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search name/email…"
                className="h-11 w-full min-w-[200px] rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 sm:w-56"
              />
              <button
                className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                <SortTh
                  label="Status"
                  sortKey="status"
                  currentSort={sort}
                  currentOrder={order}
                  q={q}
                  pageSize={pageSize}
                />
                <SortTh
                  label="Name"
                  sortKey="name"
                  currentSort={sort}
                  currentOrder={order}
                  q={q}
                  pageSize={pageSize}
                />
                <SortTh
                  label="Email"
                  sortKey="email"
                  currentSort={sort}
                  currentOrder={order}
                  q={q}
                  pageSize={pageSize}
                />
                <SortTh
                  label="Role"
                  sortKey="role"
                  currentSort={sort}
                  currentOrder={order}
                  q={q}
                  pageSize={pageSize}
                />
                <SortTh
                  label="Last login"
                  sortKey="lastLogin"
                  currentSort={sort}
                  currentOrder={order}
                  q={q}
                  pageSize={pageSize}
                />
                <SortTh
                  label="Created"
                  sortKey="created"
                  currentSort={sort}
                  currentOrder={order}
                  q={q}
                  pageSize={pageSize}
                />
                <th className="px-5 py-3 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white/90">
                    {u.fullName ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {u.email}
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {u.roleNames || "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-700 dark:text-gray-300">
                    {u.lastLoginAt
                      ? formatDateOnly(new Date(u.lastLoginAt))
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-700 dark:text-gray-300">
                    {formatDateOnly(new Date(u.createdAt))}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <ManageDropdown
                      onEdit={() => setEditUser(u)}
                      onDelete={() => setDeleteUser(u)}
                    />
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-10 text-center text-gray-600 dark:text-gray-400"
                    colSpan={7}
                  >
                    No users yet. After DB setup, run{" "}
                    <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
                      npm run db:seed
                    </code>
                    .
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div className="text-gray-600 dark:text-gray-400">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, total)} of {total}
          </div>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                href={buildUsersUrl({
                  q,
                  page: page - 1,
                  pageSize,
                  sort,
                  order,
                })}
              >
                Prev
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-400 dark:border-gray-800 dark:bg-gray-900">
                Prev
              </span>
            )}
            {page < pageCount ? (
              <Link
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                href={buildUsersUrl({
                  q,
                  page: page + 1,
                  pageSize,
                  sort,
                  order,
                })}
              >
                Next
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-400 dark:border-gray-800 dark:bg-gray-900">
                Next
              </span>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit user"
        size="lg"
      >
        {editUser ? (
          <UserEditForm
            layout="modal"
            user={{
              id: editUser.id,
              email: editUser.email,
              fullName: editUser.fullName,
              status: editUser.status,
            }}
            onCancel={() => setEditUser(null)}
            onSaved={() => {
              setEditUser(null);
              router.refresh();
            }}
          />
        ) : null}
      </Modal>

      <Modal
        open={!!deleteUser}
        onClose={() => {
          setDeleteUser(null);
          setDeleteError(null);
        }}
        title="Delete user"
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setDeleteUser(null);
                setDeleteError(null);
              }}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deletePending}
              onClick={confirmDelete}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 disabled:opacity-50"
            >
              {deletePending ? "Deleting…" : "Delete user"}
            </button>
          </>
        }
      >
        {deleteUser ? (
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              This will permanently remove{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {deleteUser.fullName ?? deleteUser.email}
              </span>{" "}
              ({deleteUser.email}). This action cannot be undone.
            </p>
            {deleteError ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {deleteError}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
