"use client";

import { SiteLogo } from "@/components/branding/SiteLogo";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const welcome =
  process.env.NEXT_PUBLIC_LOGIN_WELCOME ?? "Welcome to SaveRack";
const title = process.env.NEXT_PUBLIC_LOGIN_TITLE ?? "Sign In";
const subtitle =
  process.env.NEXT_PUBLIC_LOGIN_SUBTITLE ??
  "Enter your email and password to sign in!";
/** Inline next to welcome text — slightly smaller default than stacked layout. */
const logoWidthLeft = Number(
  process.env.NEXT_PUBLIC_LOGIN_LOGO_LEFT_WIDTH ?? "140",
);

/**
 * Credentials-only sign-in styled like TailAdmin `template/.../SignInForm.tsx`
 * (no placeholder OAuth buttons).
 */
export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res?.ok) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    router.replace("/admin/dashboard");
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center sm:pt-10">
        <div>
          <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8 sm:gap-4 lg:justify-start">
            <SiteLogo
              width={
                Number.isFinite(logoWidthLeft) && logoWidthLeft > 0
                  ? logoWidthLeft
                  : 140
              }
              className="h-12 w-auto shrink-0 object-contain sm:h-14"
            />
            <h1 className="min-w-0 text-left text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {welcome}
            </h1>
          </div>
          <div className="mb-5 sm:mb-8">
            <h2 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="email">
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-800 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-200"
                >
                  {error}
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-theme-sm text-gray-700 dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  href="/password-reset"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
