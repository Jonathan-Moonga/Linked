-- Run this in your Supabase project's SQL Editor (left sidebar → SQL Editor → New query).
-- Safe to run once, top to bottom.

-- ============================================================
-- PROFILES — app-specific fields Supabase's built-in auth.users
-- doesn't have (status, display name lookup, etc.)
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  status text not null default 'active' check (status in ('active', 'suspended', 'revoked')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone signed in can read any profile (needed for things like viewing
-- another student's name/status elsewhere in the app later). Adjust this
-- if you want profiles more private — this is a reasonable default for
-- a platform where discoverability is the point.
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- A user can only ever update their own profile, and never their own
-- status — status changes are an admin action, done with the secret key
-- from server-side code, which bypasses RLS entirely. This policy is
-- what stops a user from un-suspending themselves.
create policy "Users can update their own profile, but not their status"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and status = (select status from public.profiles where id = auth.uid()));

-- ============================================================
-- Auto-create a profile row whenever someone signs up — mirrors the
-- old handle_new_user pattern. Fires on every auth.users insert,
-- regardless of whether they signed up via password or OAuth.
-- ============================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- LOGIN ATTEMPTS — custom rate limiting. Kept because Supabase's
-- built-in auth rate limiting is IP-based (not per-account) and, as of
-- writing, has an open bug where the configured limit isn't reliably
-- enforced (supabase/auth#2333). This table preserves the exact
-- "3 failed attempts per hour per email" behavior from the original
-- build. Row Level Security is intentionally locked all the way down —
-- this table is only ever touched by server-side code using the secret
-- key, never directly by a client.
-- ============================================================

create table public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  success boolean not null,
  created_at timestamptz not null default now()
);

create index login_attempts_identifier_idx on public.login_attempts (identifier, created_at desc);

alter table public.login_attempts enable row level security;
-- No policies added on purpose — RLS with zero policies means nobody
-- using the publishable key can read or write this table at all, from
-- any client. Only server-side code with the secret key can touch it.
