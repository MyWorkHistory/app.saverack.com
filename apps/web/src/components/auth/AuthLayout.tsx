import AuthLayoutShell from "@/components/auth/AuthLayoutShell";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import React from "react";

/**
 * TailAdmin full-width auth layout: form column + brand panel (random bg + grid + logo).
 * Images load from `public/images/login-images/` (see `/api/auth/login-images`).
 */
const panelTagline =
  process.env.NEXT_PUBLIC_LOGIN_PANEL_TAGLINE ??
  "Operations and fulfillment for modern teams.";

const logoWidthRight = Number(
  process.env.NEXT_PUBLIC_LOGIN_LOGO_RIGHT_WIDTH ?? "200",
);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rightLogo =
    Number.isFinite(logoWidthRight) && logoWidthRight > 0
      ? logoWidthRight
      : 200;

  return (
    <div className="relative z-10 bg-white p-6 dark:bg-gray-900 sm:p-0">
      <AuthLayoutShell panelTagline={panelTagline} logoWidthRight={rightLogo}>
        {children}
      </AuthLayoutShell>

      <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
