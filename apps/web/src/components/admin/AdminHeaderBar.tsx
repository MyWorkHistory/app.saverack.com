"use client";

import { SiteLogo } from "@/components/branding/SiteLogo";
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDownIcon, UserCircleIcon } from "@/icons";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

/**
 * Dashboard top bar: account scope, order/inventory quick search (UI shell),
 * user block — aligned with Save Rack CRM layout, using TailAdmin tokens.
 */
export function AdminHeaderBar() {
  const { data: session } = useSession();
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [orderQuery, setOrderQuery] = useState("");
  const [inventoryQuery, setInventoryQuery] = useState("");

  const displayName = session?.user?.name ?? "Audi Kowalski";
  const roleLabel = "Admin";

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-99999 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Mobile: logo + brand + menu (matches compact Save Rack header) */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 lg:hidden dark:border-gray-800">
        <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-1.5">
          <SiteLogo width={104} className="h-9 w-auto shrink-0" />
          <span className="truncate text-xl font-semibold leading-none tracking-tight text-gray-800 dark:text-white/90 sm:text-2xl">
            SaveRack
          </span>
        </Link>
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
          onClick={handleToggle}
          aria-label="Open menu"
        >
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>
      </div>

      {/* Desktop toolbar — sidebar toggle only (brand lives in sidebar top) */}
      <div className="hidden flex-wrap items-center gap-3 px-4 py-3 lg:flex lg:px-6">
        <div className="flex shrink-0 items-center border-r border-gray-200 pr-3 dark:border-gray-800">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 lg:h-11 lg:w-11 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-white/5"
            onClick={handleToggle}
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="relative w-full min-w-[220px] max-w-full sm:min-w-[280px] lg:min-w-[320px] lg:w-[min(100%,22rem)]">
          <label htmlFor="header-account" className="sr-only">
            Account
          </label>
          <select
            id="header-account"
            defaultValue="all"
            className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-9 pl-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="all">All Accounts</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder="Search Order#"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="h-10 min-w-[140px] flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
          />
          <button
            type="button"
            className="h-10 shrink-0 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
          >
            Search
          </button>
          <input
            type="search"
            placeholder="Search Inventory"
            value={inventoryQuery}
            onChange={(e) => setInventoryQuery(e.target.value)}
            className="h-10 min-w-[140px] flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
          />
          <button
            type="button"
            className="h-10 shrink-0 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
          >
            Search
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 border-l border-gray-200 pl-4 lg:pl-5 dark:border-gray-800">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{roleLabel}</p>
          </div>
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            aria-hidden
          >
            <UserCircleIcon className="size-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Mobile: compact search row (optional second line) */}
      <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3 lg:hidden dark:border-gray-800">
        <div className="relative">
          <label htmlFor="m-account" className="sr-only">
            Account
          </label>
          <select
            id="m-account"
            defaultValue="all"
            className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-9 pl-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="all">All Accounts</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-gray-500" />
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search Order#"
            className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          <button
            type="button"
            className="h-10 shrink-0 rounded-lg bg-brand-500 px-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
          >
            Search
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search Inventory"
            className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          <button
            type="button"
            className="h-10 shrink-0 rounded-lg bg-brand-500 px-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
          >
            Search
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{displayName}</p>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
          <UserCircleIcon className="size-10 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
