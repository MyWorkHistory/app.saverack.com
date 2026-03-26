import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  /** Resolves to "Home · SaveRack" via root `title.template` */
  title: "Home",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Overview of your CRM — add widgets and KPIs here as you build out the app.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/tasks"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition hover:border-brand-200 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Tasks
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            My tasks & assignments
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tabs, filters, and task table
          </p>
        </Link>
        <Link
          href="/admin/users"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition hover:border-brand-200 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Users
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            Manage accounts
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Search, roles, and status
          </p>
        </Link>
      </div>
    </div>
  );
}
