"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { loginAction } from "./actions";
import { Field, PillButton, Divider, Terms, OAuthButton, ErrorBanner } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"credentials" | "google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading("credentials");

    try {
      const result = await loginAction(email, password);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something interrupted the sign-in request. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    setError(null);
    setLoading(provider);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });

      if (oauthError) {
        setError(`Could not start ${provider === "google" ? "Google" : "GitHub"} sign in. Make sure this provider is enabled in Supabase.`);
      }
    } catch {
      setError("Social sign in is not configured or the authentication service could not be reached.");
    } finally {
      setLoading(null);
    }
    // Browser navigates away to the provider here — no further code runs.
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <ErrorBanner message={error} />}

      <div className="flex flex-col gap-5">
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@university.edu"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <Field
            label="Password"
            toggleable
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link href="/forgot-password" className="self-end min-h-10 inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>

      <PillButton type="submit" loading={loading === "credentials"} disabled={loading !== null}>
        Sign in
      </PillButton>

      <Divider />
      <div className="grid gap-3 sm:grid-cols-2">
        <OAuthButton provider="google" loading={loading === "google"} disabled={loading !== null} onClick={() => handleOAuth("google")} />
        <OAuthButton provider="github" loading={loading === "github"} disabled={loading !== null} onClick={() => handleOAuth("github")} />
      </div>
      <p className="text-center text-sm text-slate-600">New to Linked? <Link href="/signup" className="font-bold text-sky-700 hover:underline">Create an account</Link></p>
      <Terms />
    </form>
  );
}
