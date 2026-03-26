"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  /** Random pick from `/images/login-images` (via parent fetch). */
  bgSrc: string | null;
};

/**
 * Left auth column with optional photo background from `public/images/login-images/`.
 */
export default function AuthLeftColumn({ children, bgSrc }: Props) {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      {bgSrc ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- URL from API listing */}
          <img
            src={bgSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/93 via-white/86 to-gray-50/90 dark:from-gray-900/93 dark:via-gray-900/88 dark:to-gray-950/90"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-gray-50 dark:bg-gray-900"
          aria-hidden
        />
      )}
      <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
