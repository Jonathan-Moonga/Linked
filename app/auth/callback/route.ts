import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where Google/GitHub redirect back to after the user approves sign-in.
 * The URL includes a one-time `code`; this exchanges it for a real
 * session and sets the session cookies via the server client, then
 * sends the browser on to the actual app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
