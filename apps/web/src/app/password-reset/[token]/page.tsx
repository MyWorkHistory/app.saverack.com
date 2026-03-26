"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PasswordResetConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const tokenParam = params?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/password-reset/confirm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (!res.ok) {
      setError("Invalid or expired token.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.replace("/login"), 700);
  }

  return (
    <AuthLayout>
      <div className="flex w-full flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center sm:pt-10">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Set new password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a strong password to secure your account.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label>
                New password <span className="text-error-500">*</span>
              </Label>
              <Input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <Label>
                Confirm password <span className="text-error-500">*</span>
              </Label>
              <Input
                name="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-lg border border-success-200 bg-success-50 px-3 py-2 text-sm text-success-800 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
                Password updated. Redirecting to login…
              </div>
            ) : null}

            <Button className="w-full" size="sm" type="submit">
              Update password
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
