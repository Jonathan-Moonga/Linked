"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, recordAttempt, RateLimitedError } from "@/lib/rate-limit";

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function loginAction(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string; rateLimited?: boolean }> {
  const identifier = normalizeEmail(email);

  if (!identifier || !password) {
    return { ok: false, error: "Enter both your email and password." };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    !process.env.SUPABASE_SECRET_KEY
  ) {
    return {
      ok: false,
      error: "Sign in is not configured yet. Add the Supabase URL, publishable key, and secret key to .env, then restart the app.",
    };
  }

  // Checked BEFORE calling Supabase — this is what actually stops
  // credential-stuffing, same principle as the original build: the gate
  // matters more than the password hash algorithm behind it.
  try {
    await checkRateLimit(identifier);
  } catch (err) {
    if (err instanceof RateLimitedError) {
      return { ok: false, error: "Too many attempts. Try again in a bit, or reset your password below.", rateLimited: true };
    }

    // A brief network interruption should not immediately strand the user,
    // but the security gate still fails closed if the retry also fails.
    await new Promise((resolve) => setTimeout(resolve, 250));
    try {
      await checkRateLimit(identifier);
    } catch (retryError) {
      if (retryError instanceof RateLimitedError) {
        return { ok: false, error: "Too many attempts. Try again in a bit, or reset your password below.", rateLimited: true };
      }
      console.error("Could not check the login rate limit after retry:", retryError);
      const rawMessage = retryError instanceof Error
        ? retryError.message
        : typeof retryError === "object" && retryError !== null && "message" in retryError
          ? String(retryError.message)
          : "Unknown security-check error";
      const message = rawMessage.toLowerCase();
      const developmentDetail = process.env.NODE_ENV === "development"
        ? ` Development detail: ${rawMessage.slice(0, 240)}`
        : "";
      return {
        ok: false,
        error: message.includes("fetch") || message.includes("network")
          ? `The app could not reach Supabase. Restart the local server and check your internet connection, then try again.${developmentDetail}`
          : `The login security check could not read the login_attempts table. Verify the Supabase schema and server key, then try again.${developmentDetail}`,
      };
    }
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: identifier, password });

    try {
      await recordAttempt(identifier, !error);
    } catch (recordError) {
      console.error("Could not record the login attempt:", recordError);
    }

    if (error) {
      if (error.code === "email_not_confirmed") {
        return { ok: false, error: "Confirm your email address before signing in. Check your inbox for the confirmation link." };
      }
      if (error.code === "invalid_credentials") {
        return { ok: false, error: "The email or password is incorrect. Check both fields or reset your password." };
      }
      if (error.status === 429) {
        return { ok: false, error: "The authentication service received too many requests. Wait a moment and try again." };
      }

      console.error("Supabase sign-in failed:", error);
      return { ok: false, error: "The authentication service could not complete sign in. Please try again shortly." };
    }

    return { ok: true };
  } catch (err) {
    console.error("Unexpected sign-in failure:", err);
    return {
      ok: false,
      error: "Could not reach the authentication service. Check your connection and Supabase settings, then try again.",
    };
  }
}
