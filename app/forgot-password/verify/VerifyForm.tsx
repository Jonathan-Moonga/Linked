"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CodeInput, PillButton, ErrorBanner } from "@/components/ui";

export function VerifyForm({ email }: { email: string }) {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const code = digits.join("");
  const complete = code.length === 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) return;
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: code, type: "recovery" });
      if (verifyError) {
        setError(verifyError.status === 429
          ? "Too many verification attempts. Wait a moment and try again."
          : "That code is invalid or expired. Request a new code and try again.");
        setDigits(["", "", "", "", "", ""]);
        document.getElementById("code-0")?.focus();
        return;
      }
      router.push("/forgot-password/reset");
    } catch {
      setError("Could not verify the code. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resetPasswordForEmail(email);
      if (resendError) {
        setError(resendError.status === 429
          ? "Please wait before requesting another reset email."
          : "The reset email could not be requested. Please try again.");
        return;
      }
      setResendCooldown(60);
    } catch {
      setError("Could not reach the authentication service. Please try again.");
      return;
    }

    const interval = setInterval(() => {
      setResendCooldown((seconds) => {
        if (seconds <= 1) {
          clearInterval(interval);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && <ErrorBanner message={error} />}
      <CodeInput values={digits} onChange={setDigits} />
      <PillButton type="submit" disabled={!complete} loading={loading}>
        Verify
      </PillButton>
      <button
        type="button"
        onClick={handleResend}
        disabled={resendCooldown > 0 || loading}
        className="min-h-11 self-center text-sm font-semibold text-sky-700 hover:underline disabled:text-slate-400"
      >
        {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : "Didn't get a code? Resend."}
      </button>
    </form>
  );
}
