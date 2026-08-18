import { createBrowserClient } from "@supabase/ssr";

/**
 * For Client Components only — anything with "use client" at the top.
 * Uses the publishable key, safe to expose, since every operation this
 * client performs runs in the context of whoever's actually logged in
 * (or not logged in), with Row Level Security as the real gatekeeper.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
