"use client";

import AuthLeftColumn from "@/components/auth/AuthLeftColumn";
import AuthRightPanel from "@/components/auth/AuthRightPanel";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  panelTagline: string;
  logoWidthRight: number;
};

/**
 * Single fetch of `/images/login-images` → random distinct backgrounds for left & right when possible.
 */
export default function AuthLayoutShell({
  children,
  panelTagline,
  logoWidthRight,
}: Props) {
  const [leftBg, setLeftBg] = useState<string | null>(null);
  const [rightBg, setRightBg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/login-images")
      .then((r) => r.json() as Promise<{ paths?: string[] }>)
      .then((data) => {
        if (cancelled) return;
        const paths = data.paths ?? [];
        if (paths.length === 0) return;
        if (paths.length === 1) {
          const only = paths[0]!;
          setLeftBg(only);
          setRightBg(only);
          return;
        }
        const shuffled = [...paths].sort(() => Math.random() - 0.5);
        setLeftBg(shuffled[0]!);
        setRightBg(shuffled[1]!);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col justify-center bg-white dark:bg-gray-900 sm:p-0 lg:flex-row">
      <AuthLeftColumn bgSrc={leftBg}>{children}</AuthLeftColumn>
      <AuthRightPanel
        panelTagline={panelTagline}
        bgSrc={rightBg}
        logoWidth={logoWidthRight}
      />
    </div>
  );
}
