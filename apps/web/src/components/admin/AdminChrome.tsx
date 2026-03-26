"use client";

import { AdminHeaderBar } from "@/components/admin/AdminHeaderBar";
import { SiteLogo } from "@/components/branding/SiteLogo";
import Backdrop from "@/layout/Backdrop";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { GroupIcon, PieChartIcon, TaskIcon } from "@/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";
import { twMerge } from "tailwind-merge";

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

type NavItemProps = {
  href: string;
  label: string;
  active: boolean;
  showText: boolean;
  icon: React.ReactNode;
};

function SidebarNavItem({ href, label, active, showText, icon }: NavItemProps) {
  return (
    <Link
      href={href}
      title={!showText ? label : undefined}
      className={twMerge(
        "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-theme-sm font-medium transition-colors duration-200",
        active
          ? "bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-500/[0.14] dark:text-brand-300"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-white",
        !showText && "justify-center px-2"
      )}
    >
      <span
        className={twMerge(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 [&>svg]:size-5",
          active
            ? "bg-brand-500 text-white shadow-sm dark:bg-brand-500"
            : "bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-700 dark:group-hover:bg-white/10 dark:group-hover:text-gray-200"
        )}
      >
        {icon}
      </span>
      {showText ? (
        <span className="truncate font-medium">{label}</span>
      ) : null}
      {active && showText ? (
        <span
          className="absolute top-1/2 right-3 h-6 w-1 -translate-y-1/2 rounded-full bg-brand-500 dark:bg-brand-400"
          aria-hidden
        />
      ) : null}
    </Link>
  );
}

function SidebarNav() {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebar();

  const showText = isExpanded || isHovered || isMobileOpen;
  const isDashboard = pathname?.startsWith("/admin/dashboard");
  const isTasks = pathname?.startsWith("/admin/tasks");
  const isUsers = pathname?.startsWith("/admin/users");
  const sidebarWidthClass = showText ? "w-[280px]" : "w-[88px]";

  return (
    <aside
      className={twMerge(
        "fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-gray-200/90 bg-white transition-all duration-300 ease-out dark:border-gray-800 dark:bg-gray-900",
        "shadow-[4px_0_24px_-12px_rgba(15,23,42,0.08)] dark:shadow-[4px_0_32px_-12px_rgba(0,0,0,0.45)]",
        "max-lg:shadow-theme-lg",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={twMerge("flex h-full min-h-0 flex-col", sidebarWidthClass)}>
        {/* Brand */}
        <div className="shrink-0 border-b border-gray-100 px-4 py-5 dark:border-gray-800/80">
          <Link
            href="/admin/dashboard"
            className={twMerge(
              "flex items-center transition-opacity hover:opacity-90",
              showText ? "gap-0" : "justify-center"
            )}
          >
            <span className={showText ? "shrink-0 -mr-4 [&_img]:block" : undefined}>
              <SiteLogo
                width={showText ? 112 : 44}
                className={
                  showText
                    ? "max-h-10 w-auto max-w-[112px] object-left"
                    : "max-h-9 w-auto max-w-[44px] object-contain"
                }
              />
            </span>
            {showText ? (
              <span className="shrink-0 -translate-x-1 text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                SaveRack
              </span>
            ) : null}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 py-4 custom-scrollbar">
          {showText ? (
            <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Menu
            </p>
          ) : (
            <div className="h-1 shrink-0" aria-hidden />
          )}
          <SidebarNavItem
            href="/admin/dashboard"
            label="Dashboard"
            active={!!isDashboard}
            showText={showText}
            icon={<PieChartIcon />}
          />
          <SidebarNavItem
            href="/admin/tasks"
            label="Tasks"
            active={!!isTasks}
            showText={showText}
            icon={<TaskIcon />}
          />
          <SidebarNavItem
            href="/admin/users"
            label="Users"
            active={!!isUsers}
            showText={showText}
            icon={<GroupIcon />}
          />
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 p-3 dark:border-gray-800">
          <button
            type="button"
            title={!showText ? "Sign out" : undefined}
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={twMerge(
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-theme-sm font-medium transition-colors",
              "text-gray-600 hover:bg-red-50 hover:text-red-700 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400",
              !showText && "justify-center px-2"
            )}
          >
            <span
              className={twMerge(
                "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                "border-gray-200 bg-gray-50 text-gray-500 group-hover:border-red-200 group-hover:bg-red-50 group-hover:text-red-600",
                "dark:border-gray-700 dark:bg-gray-800/50 dark:group-hover:border-red-500/30 dark:group-hover:bg-red-500/10 dark:group-hover:text-red-400"
              )}
            >
              <LogOutIcon className="size-5" />
            </span>
            {showText ? <span>Sign out</span> : null}
          </button>
        </div>
      </div>
    </aside>
  );
}

function AdminChromeInner({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[280px]"
      : "lg:ml-[88px]";

  return (
    <div className="min-h-screen xl:flex">
      <SidebarNav />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-out ${mainContentMargin}`}
      >
        <AdminHeaderBar />
        <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

export function AdminChrome({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminChromeInner>{children}</AdminChromeInner>
    </SidebarProvider>
  );
}
