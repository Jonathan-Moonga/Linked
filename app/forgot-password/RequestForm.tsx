"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, PillButton, ErrorBanner } from "@/components/ui";
import { requestResetAction } from "./actions";

export function RequestForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await requestResetAction(email);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push(`/forgot-password/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch {
      setError("Something interrupted the reset request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <ErrorBanner message={error} />}
      <Field label="Email" type="email" autoComplete="email" placeholder="you@university.edu" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <p className="rounded-xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">Delivery can take a minute. Check your spam folder if you don&rsquo;t see the email.</p>
      <PillButton type="submit" loading={loading}>
        Send Code
      </PillButton>
      <Link
        href="/login"
        className="flex min-h-11 items-center justify-center text-sm font-semibold text-sky-700 hover:underline"
      >
        Remembered your password? Sign in.
      </Link>
    </form>
  );
}
