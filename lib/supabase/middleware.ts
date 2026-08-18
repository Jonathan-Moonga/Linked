import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/signup/success",
  "/forgot-password",
  "/forgot-password/verify",
  "/forgot-password/reset",
  "/forgot-password/success",
];

const AUTH_ONLY_REDIRECT_ROUTES = ["/login", "/signup"];

/**
 * Unlike the old Auth.js middleware — which deliberately avoided calling
 * the database from the Edge Runtime and did a cheap cookie-presence
 * check instead — Supabase's session needs this middleware to actually
 * run on every request. Its job: call supabase.auth.getUser(), which
 * both refreshes an expiring token AND verifies it with the auth server
 * (not just trusting a locally-decoded JWT). Skipping this middleware
 * doesn't just weaken the check the way it did before — sessions would
 * silently stop refreshing and everyone gets logged out when their
 * token expires.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.includes(path);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Keep the public auth UI usable during initial local setup. Supabase's
  // client otherwise throws before Next.js can render even the login page.
  if (!supabaseUrl || !supabaseKey) {
    if (isPublicRoute) return NextResponse.next({ request });

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  // getUser() (not getSession()) — this actually re-validates with the
  // Supabase Auth server rather than trusting a potentially-stale local
  // token, the same "authoritative check" principle the old app_session
  // table existed to provide.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && AUTH_ONLY_REDIRECT_ROUTES.includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Important: return supabaseResponse as-is, not a fresh NextResponse —
  // the cookies Supabase just set on it need to actually reach the
  // browser, or the session desyncs between client and server.
  return supabaseResponse;
}
