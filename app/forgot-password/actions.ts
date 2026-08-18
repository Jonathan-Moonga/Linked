"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestResetAction(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return { ok: false, error: "Enter your email address." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);

    if (!error) return { ok: true };

    console.error("Supabase password-reset request failed:", error);
    if (error.status === 429 || error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit") {
      return { ok: false, error: "Too many reset emails were requested. Wait a few minutes and try again." };
    }
    if (error.code === "email_address_invalid") {
      return { ok: false, error: "Enter a valid email address." };
    }

    return { ok: false, error: `The reset email could not be requested: ${error.message}` };
  } catch (error) {
    console.error("Unexpected password-reset request failure:", error);
    return { ok: false, error: "Could not reach the authentication service. Check your connection and try again." };
  }
}
