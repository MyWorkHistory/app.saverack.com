"use client";

import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const TRANSITION_MS = 220;

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Wider panel for forms */
  size?: "md" | "lg";
};

/**
 * TailAdmin-style modal: dimmed backdrop, rounded card, shadow.
 * Enter/exit use opacity + scale + translate with delayed unmount on close.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const hasBeenOpenRef = useRef(false);

  useEffect(() => {
    if (open) {
      hasBeenOpenRef.current = true;
      setMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
      return () => cancelAnimationFrame(id);
    }

    setAnimateIn(false);
    if (!hasBeenOpenRef.current) return;
    const hideTimer = window.setTimeout(() => {
      setMounted(false);
    }, TRANSITION_MS);
    return () => clearTimeout(hideTimer);
  }, [open]);

  useEffect(() => {
    if (!mounted || !animateIn) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, animateIn, onClose]);

  if (!mounted) return null;

  const maxW = size === "lg" ? "max-w-lg" : "max-w-md";

  return (
    <div
      className="fixed inset-0 z-99999 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className={twMerge(
          "absolute inset-0 bg-gray-900/50 backdrop-blur-[1px] transition-opacity duration-200 ease-out motion-reduce:transition-none motion-reduce:opacity-100 dark:bg-gray-950/60",
          animateIn ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className={twMerge(
          "relative z-10 w-full rounded-2xl border border-gray-200 bg-white shadow-theme-xl transition duration-200 ease-out motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900",
          "motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100",
          animateIn
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.97] opacity-0",
          maxW,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-900 dark:text-white/90"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
