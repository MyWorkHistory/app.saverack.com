"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { useState } from "react";

export default function PasswordResetRequestPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [debugToken, setDebugToken] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDebugToken(null);

    const res = await fetch("/api/password-reset/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const body = (await res.json().catch(() => null)) as
      | { ok: boolean; debugToken?: string }
      | null;

    setSent(true);
    setDebugToken(body?.debugToken ?? null);
  }

  return (
    <AuthLayout>
      <div className="flex w-full flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center sm:pt-10">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
                Forgot password?
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your registered email and we&apos;ll send a reset link.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <Label htmlFor="reset-email">
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <Button className="w-full" size="sm" type="submit">
                Email password reset link
              </Button>
            </form>

            {sent ? (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
                If that email exists, a reset link has been sent.
              </div>
            ) : null}

            {debugToken ? (
              <div className="mt-4 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-800 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">
                Dev token:{" "}
                <Link
                  className="font-medium underline"
                  href={`/password-reset/${debugToken}`}
                >
                  Open reset page
                </Link>
              </div>
            ) : null}

            <div className="mt-6 text-center text-sm sm:text-start">
              <Link
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                href="/login"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
