"use client";

import { SiteLogo } from "@/components/branding/SiteLogo";
import GridShape from "@/components/common/GridShape";
import Link from "next/link";

type Props = {
  panelTagline: string;
  /** Background from parent (`/images/login-images`). */
  bgSrc: string | null;
  /** Typical TailAdmin-sized logo (~200px). */
  logoWidth?: number;
};

export default function AuthRightPanel({
  panelTagline,
  bgSrc,
  logoWidth = 200,
}: Props) {
  return (
    <div className="relative hidden h-full w-full overflow-hidden lg:block lg:w-1/2">
      {bgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL from API listing
        <img
          src={bgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-950 to-gray-950"
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-brand-950/55"
        aria-hidden
      />
      <div className="relative z-10 flex h-full min-h-[400px] items-center justify-center lg:min-h-0">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <GridShape />
        </div>
        <div className="relative z-20 flex max-w-sm flex-col items-center px-6">
          <Link href="/" className="mb-4 block">
            <SiteLogo
              width={logoWidth}
              className="max-h-28 w-auto object-contain drop-shadow-md sm:max-h-32"
            />
          </Link>
          <p className="text-center text-sm leading-relaxed text-white/85 drop-shadow-sm">
            {panelTagline}
          </p>
        </div>
      </div>
    </div>
  );
}
