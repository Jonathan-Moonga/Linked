"use server";

import { createClient } from "@/lib/supabase/server";

export async function signupAction(
  name: string,
  email: string,
  password: string
): Promise<{ ok: true; requiresEmailConfirmation: boolean } | { ok: false; error: string }> {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedName || !normalizedEmail || !password) {
    return { ok: false, error: "Enter your name, email, and password." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Your password must be at least 8 characters long." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { name: normalizedName } },
    });

    if (error) {
      console.error("Supabase signup failed:", error);

      if (error.message.toLowerCase().includes("sending confirmation email")) {
        return {
          ok: false,
          error: "Supabase could not send the confirmation email. Configure custom SMTP in Supabase, or test with an email belonging to a member of your Supabase organization.",
        };
      }

      switch (error.code) {
        case "weak_password":
          return { ok: false, error: "That password is too weak. Use a longer password with a mix of characters." };
        case "email_address_invalid":
          return { ok: false, error: "Enter a valid email address." };
        case "email_address_not_authorized":
          return { ok: false, error: "This project currently allows only approved email addresses." };
        case "signup_disabled":
          return { ok: false, error: "New account registration is disabled in Supabase Auth settings." };
        case "over_email_send_rate_limit":
        case "over_request_rate_limit":
          return { ok: false, error: "Too many signup or confirmation requests were sent. Wait a few minutes and try again." };
        case "user_already_exists":
          return { ok: false, error: "An account may already use this email. Try signing in or resetting your password." };
        default:
          return { ok: false, error: `Account creation failed: ${error.message}` };
      }
    }

    return { ok: true, requiresEmailConfirmation: !data.session };
  } catch (error) {
    console.error("Unexpected signup failure:", error);
    return { ok: false, error: "Could not reach the authentication service. Check your connection and Supabase settings, then try again." };
  }
}
