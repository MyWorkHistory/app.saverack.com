"use client";

import Label from "@/components/form/Label";
import type { UserStatus } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type User = {
  id: string;
  email: string;
  fullName: string | null;
  status: UserStatus;
};

type Props = {
  user: User;
  /** When set, Save calls onSaved instead of navigating away */
  onSaved?: () => void;
  onCancel?: () => void;
  layout?: "page" | "modal";
};

export function UserEditForm({
  user,
  onSaved,
  onCancel,
  layout = "page",
}: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim() || null,
          status,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Update failed");
        return;
      }
      if (onSaved) {
        onSaved();
        return;
      }
      router.push("/admin/users");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const formInner = (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Email</Label>
        <input
          readOnly
          value={user.email}
          className="mt-1.5 h-11 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400"
        />
      </div>
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1.5 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as UserStatus)}
          className="mt-1.5 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        >
          <option value="PENDING">PENDING</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      {layout === "modal" ? (
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
          <Link
            href="/admin/users"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
          >
            Cancel
          </Link>
        </div>
      )}
    </form>
  );

  if (layout === "modal") {
    return formInner;
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          ← Back to users
        </Link>
        <h1 className="mt-4 text-title-md font-semibold text-gray-800 dark:text-white/90">
          Edit user
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update profile fields. Email is read-only.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
        {formInner}
      </div>
    </div>
  );
}
