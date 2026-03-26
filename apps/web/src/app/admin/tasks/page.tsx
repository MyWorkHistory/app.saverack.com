"use client";

import Label from "@/components/form/Label";
import React, { useState } from "react";

type TasksTab = "my" | "assigned" | "all";

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function SortHint() {
  return (
    <span className="ml-1 inline-block text-[10px] font-normal text-gray-400 dark:text-gray-500" aria-hidden>
      ⇅
    </span>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500";

const selectClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

export default function AdminTasksPage() {
  const [tab, setTab] = useState<TasksTab>("my");
  const [taskName, setTaskName] = useState("");

  const tabBtn = (id: TasksTab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
        tab === id
          ? "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">Tasks</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage tasks by scope — filters and data wiring come next.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabBtn("my", "My Tasks")}
          {tabBtn("assigned", "My Assigned Tasks")}
          {tabBtn("all", "All Tasks")}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-theme-xs hover:bg-brand-600"
        >
          <GearIcon className="shrink-0 text-white" />
          Create
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="text-sm font-semibold text-gray-800 dark:text-white/90">Task list</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Filter by name, type, assignment, and account</div>
        </div>

        <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[160px] flex-1 sm:max-w-[220px]">
              <Label>Task Name</Label>
              <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="min-w-[140px]">
              <Label>Type</Label>
              <select className={selectClass} defaultValue="">
                <option value="">All</option>
              </select>
            </div>
            <div className="min-w-[160px]">
              <Label>Assigned By</Label>
              <select className={selectClass} defaultValue="">
                <option value="">All</option>
              </select>
            </div>
            <div className="min-w-[200px] w-full sm:min-w-[280px] sm:w-auto lg:min-w-[320px]">
              <Label>Accounts</Label>
              <select className={selectClass} defaultValue="">
                <option value="">All Accounts</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
              >
                <SearchIcon className="text-white" />
                Search
              </button>
              <button
                type="button"
                className="h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/5"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                <th className="px-5 py-3">
                  Status
                  <SortHint />
                </th>
                <th className="px-5 py-3">
                  Task Name
                  <SortHint />
                </th>
                <th className="px-5 py-3">
                  Account
                  <SortHint />
                </th>
                <th className="px-5 py-3">
                  Due In
                  <SortHint />
                </th>
                <th className="px-5 py-3">
                  Due Date
                  <SortHint />
                </th>
                <th className="px-5 py-3">
                  Assigned By
                  <SortHint />
                </th>
                <th className="px-5 py-3">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <tr>
                <td
                  className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={7}
                >
                  There are no records to show
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          {(["<<", "<", "1", ">", ">>"] as const).map((p) => (
            <button
              key={p}
              type="button"
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium ${
                p === "1"
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
