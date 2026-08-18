import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * For Server Components, Server Actions, and Route Handlers — anything
 * that runs on the server and needs to know who's logged in. Reads/writes
 * the session via cookies, which is how Supabase's SSR helpers keep the
 * server and browser in sync.
 *
 * Server Components can't actually write cookies (a Next.js restriction,
 * not a Supabase one) — the try/catch below swallows that specific case,
 * since middleware.ts is what actually persists refreshed session
 * cookies on every request. Without that middleware doing its job,
 * sessions would silently stop refreshing; see middleware.ts for why
 * it's not optional here.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component — expected, middleware.ts handles persistence.
          }
        },
      },
    }
  );
}
