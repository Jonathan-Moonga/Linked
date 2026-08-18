import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Uses the SECRET key (sb_secret_...) — bypasses Row Level Security
 * entirely. This file must never be imported into anything with
 * "use client" at the top, and never into a file that ships to the
 * browser.
 *
 * What actually needs this, and why each one is a deliberate choice:
 *   - lib/rate-limit.ts: `login_attempts` has zero RLS policies on
 *     purpose (see supabase/schema.sql) — nothing using the public key
 *     can touch it at all, so checking/recording attempts has to go
 *     through this client.
 *   - Force-revoking a suspended user's session (admin action, not yet
 *     wired up) will use supabase.auth.admin.signOut(), which also
 *     requires this client.
 */
export function createAdminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
