"use client";

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

const DEFAULT_LOGO = "/assets/images/logo.jpg";

export function SiteLogo({
  className = "",
  width = 140,
}: {
  className?: string;
  /** Max width in CSS pixels */
  width?: number;
}) {
  const src = useMemo(() => {
    const env = process.env.NEXT_PUBLIC_CRM_LOGO_PATH;
    if (typeof env === "string" && env.length > 0) return env;
    return DEFAULT_LOGO;
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- avoids next/image + onError hydration mismatches
    <img
      src={src}
      alt="SaveRack"
      suppressHydrationWarning
      className={twMerge("h-auto max-w-full object-contain", className)}
      style={{ width, height: "auto" }}
      loading="eager"
      decoding="async"
    />
  );
}
