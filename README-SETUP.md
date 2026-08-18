# Linked app setup

This guide explains how to run the Linked authentication app with your own Supabase project. The repository does not include real environment credentials.

## Requirements

- Node.js 18.17 or newer
- npm
- A Supabase project

## 1. Install the project

Clone the repository, enter its directory, and install dependencies:

```bash
git clone https://github.com/Jonathan-Moonga/Linked.git
cd Linked
npm install
```

## 2. Create the database tables

1. Open your project in the Supabase dashboard.
2. Select **SQL Editor** and create a new query.
3. Copy all SQL from `supabase/schema.sql` into the editor.
4. Run the query once.

This creates the `profiles` and `login_attempts` tables, their security rules, and the new-user profile trigger. Sign-in will fail its security check if this schema has not been installed.

## 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

In **Supabase Dashboard → Project Settings → API Keys**, copy the values into `.env`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
SUPABASE_SECRET_KEY=sb_secret_your_key_here
```

Use the project's publishable key for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and its secret key for `SUPABASE_SECRET_KEY`. Older Supabase projects may display equivalent legacy `anon` and `service_role` keys.

The secret key bypasses Row Level Security and is used only by server-side rate-limit code. Never give it a `NEXT_PUBLIC_` name, put it in client-side code, or commit your completed `.env` file.

## 4. Configure authentication

In **Supabase Dashboard → Authentication**:

1. Enable email/password sign-in under **Providers**.
2. Set the site URL to `http://localhost:3000` for local development.
3. Add `http://localhost:3000/auth/callback` to the allowed redirect URLs.
4. Configure custom SMTP if users outside your Supabase organization need confirmation and password-reset emails.
5. To use Google or GitHub login, enable each provider and enter the OAuth credentials requested by Supabase.

For a deployed app, also add the production site URL and `https://your-domain.com/auth/callback` to the allowed URLs.

## 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Restart the development server whenever you change `.env`.

## Production deployment

Add the same three environment variables to your hosting provider's project settings. Do not upload or commit `.env`. After configuring the production URLs in Supabase, build the app with:

```bash
npm run build
npm start
```

## Validation commands

```bash
npm run typecheck
npm run build
```

If sign-in reports that its security check failed, confirm that `supabase/schema.sql` ran successfully and that `SUPABASE_SECRET_KEY` belongs to the same Supabase project as the URL and publishable key.
