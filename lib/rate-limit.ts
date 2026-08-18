import { createAdminClient } from "./supabase/admin";

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_ATTEMPTS = 3;

export class RateLimitedError extends Error {
  retryAfterMs: number;
  constructor(retryAfterMs: number) {
    super("Too many attempts. Try again later.");
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * Same semantics as the original Drizzle version: only failures after
 * the most recent success (if any) within the window count, so a user
 * who mistypes twice then gets in isn't penalized on their next visit.
 */
export async function checkRateLimit(identifier: string): Promise<void> {
  const supabase = createAdminClient();
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  const { data: recent, error } = await supabase
    .from("login_attempts")
    .select("success, created_at")
    .eq("identifier", identifier)
    .gt("created_at", windowStart)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!recent) return;

  const mostRecentSuccessIdx = recent.findIndex((a) => a.success);
  const relevantFailures = mostRecentSuccessIdx === -1 ? recent : recent.slice(0, mostRecentSuccessIdx);

  if (relevantFailures.length >= MAX_ATTEMPTS) {
    const oldest = relevantFailures[relevantFailures.length - 1];
    const oldestTimestamp = new Date(oldest.created_at).getTime();
    const retryAfterMs = oldestTimestamp + WINDOW_MS - Date.now();
    throw new RateLimitedError(Math.max(retryAfterMs, 0));
  }
}

export async function recordAttempt(identifier: string, success: boolean): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("login_attempts").insert({ identifier, success });
  if (error) throw error;
}
