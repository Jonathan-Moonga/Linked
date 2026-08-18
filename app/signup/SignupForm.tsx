"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signupAction } from "./actions";
import Link from "next/link";
import { Field, PillButton, Divider, Terms, OAuthButton, ErrorBanner, PasswordRequirements } from "@/components/ui";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState<"credentials" | "google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirmError(null);

    if (password !== confirm) {
      setConfirmError("Passwords don't match.");
      return;
    }

    setLoading("credentials");

    try {
      const signupResult = await signupAction(name, email, password);
      if (!signupResult.ok) {
        setError(signupResult.error);
        return;
      }

      router.push(signupResult.requiresEmailConfirmation ? "/signup/success?confirmation=email" : "/signup/success");
      router.refresh();
    } catch {
      setError("Something interrupted account creation. Please try again.");
    } finally {
      setLoading(null);
    }

    return;

    // Signing up doesn't automatically log you in server-side the way
    // the old flow did — so we sign in right after, same end result for
    // the person using the app, just two steps under the hood instead
    // of one.
  }

  async function handleOAuth(provider: "google" | "github") {
    setError(null);
    setLoading(provider);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } });
      if (oauthError) setError(`Could not start ${provider === "google" ? "Google" : "GitHub"} sign up. Make sure the provider is enabled in Supabase.`);
    } catch {
      setError("Social sign up is not configured or the authentication service could not be reached.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <ErrorBanner message={error} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" autoComplete="name" placeholder="Your full name" required value={name} onChange={(e) => setName(e.target.value)} />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@university.edu"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          toggleable
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Field
          label="Confirm Password"
          toggleable
          autoComplete="new-password"
          required
          value={confirm}
          error={confirmError ?? (confirm && password !== confirm ? "Passwords don't match yet." : undefined)}
          onChange={(e) => {
            setConfirm(e.target.value);
            setConfirmError(null);
          }}
        />
        <div className="sm:col-span-2"><PasswordRequirements password={password} /></div>
      </div>

      <PillButton type="submit" loading={loading === "credentials"} disabled={loading !== null}>
        Sign Up
      </PillButton>

      <Divider />
      <div className="grid gap-3 sm:grid-cols-2">
        <OAuthButton provider="google" loading={loading === "google"} disabled={loading !== null} onClick={() => handleOAuth("google")} />
        <OAuthButton provider="github" loading={loading === "github"} disabled={loading !== null} onClick={() => handleOAuth("github")} />
      </div>
      <p className="text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-bold text-sky-700 hover:underline">Sign in</Link></p>
      <Terms />
    </form>
  );
}
