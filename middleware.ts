import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Migrated from the old cookie-presence-check approach (Auth.js +
 * Edge Runtime constraints) to Supabase's session-refresh middleware.
 * See lib/supabase/middleware.ts for why this one actually needs to
 * touch the network on every request, unlike the old one.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
