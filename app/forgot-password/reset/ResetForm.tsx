"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ErrorBanner, Field, PasswordRequirements, PillButton } from "@/components/ui";

export function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.replace("/forgot-password"); });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirmError(null);
    if (password !== confirmPassword) { setConfirmError("Passwords don't match."); return; }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) { setError("This reset session may have expired. Request another recovery code and try again."); return; }
      await supabase.auth.signOut();
      router.push("/forgot-password/success");
    } catch {
      setError("Could not update your password. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <ErrorBanner message={error} />}
      <Field label="New password" toggleable autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      <PasswordRequirements password={password} />
      <Field label="Confirm new password" toggleable autoComplete="new-password" required value={confirmPassword} error={confirmError ?? (confirmPassword && password !== confirmPassword ? "Passwords don't match yet." : undefined)} onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(null); }} />
      <PillButton type="submit" loading={loading}>Reset password</PillButton>
    </form>
  );
}
