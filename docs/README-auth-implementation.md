<div align="center">

# Linked — Auth Sequence

**Where student ideas find their team.**

Sign up, sign in, and password recovery for Linked (Synapse) — a research collaboration platform connecting student researchers across universities.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-orange)](https://authjs.dev)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#license)

</div>

---

## What's in this repo

A complete, working implementation of Linked's mobile auth flow — built from the Figma prototype and wired to a real database, not just static screens.

- **Sign up / sign in** with email and password
- **Google & GitHub OAuth**
- **Forgot password** — 6-digit code, hashed and expiring, single use
- **Rate limiting** — 3 failed login attempts per hour, per account
- **Revocable sessions** — flip an account to suspended and it loses access on its next request, no waiting for a token to expire

## Screens

| Screen | Route |
|---|---|
| Sign in | `/login` |
| Sign up | `/signup` |
| Account created | `/signup/success` |
| Forgot password | `/forgot-password` |
| Verify code | `/forgot-password/verify` |
| Set new password | `/forgot-password/reset` |
| Reset complete | `/forgot-password/success` |

Designs live in the [Figma prototype](https://www.figma.com/design/TIxkBM5aVrIXGgcGsaQJkD) — every screen here matches it field-for-field.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Auth | Auth.js v5 |
| Database | SQLite via Drizzle ORM *(swap for Postgres in production — see below)* |
| Password hashing | Argon2id |
| Styling | Tailwind CSS |

## Getting started

```bash
git clone <this-repo>
cd linked-auth
npm install
```

Set up your environment:

```bash
cp .env.example .env
npx auth secret              # fills in AUTH_SECRET
openssl rand -hex 32         # paste the output into RESET_TOKEN_SECRET
```

Set up the database and run it:

```bash
npm run db:migrate
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**. Email/password sign-up, sign-in, and password reset all work immediately — no external services required. The reset code prints to your terminal instead of sending a real email until `RESEND_API_KEY` is set.

Google and GitHub sign-in need real OAuth credentials in `.env` first — see the comments in `.env.example` for where to get them and which redirect URLs to register.

## Project structure

```
app/                  Pages and API routes
  login/, signup/, forgot-password/    Screens
  api/                                 Auth routes
auth.ts              Auth.js configuration
db/schema.ts         Database tables
lib/                 Password hashing, rate limiting, reset codes, sessions
components/ui.tsx    Shared UI components
```

## Before production

This is built to run with zero external dependencies for easy local setup. A few things to swap before shipping:

- **SQLite → Postgres** — `db/schema.ts` is plain Drizzle and maps directly to `drizzle-orm/postgres-js`
- **Rate limiter → Redis** — currently DB-backed; swap for `@upstash/ratelimit` without touching call sites
- **Email → a real provider** — `lib/email.ts` already posts to Resend if `RESEND_API_KEY` is set

## License

MIT
