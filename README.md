# Wishlylist

Places to go, things to buy, services, movies and books — in private, family, friends and public lists.
Sign-in and data: Supabase. Hosting: Vercel. No Claude account needed to use it.

## Lists
- **Private**: only you. Everyone gets one ("My list") when they sign up.
- **Family / Friends**: you create it, then share an invite link (WhatsApp, copy, share). Anyone who opens it, signs in and joins can add, edit and tick off items.
- **Public**: anyone with the link can view it without an account. Only people you invite can edit it.

## One-time setup
1. **Supabase → SQL Editor → New query**: paste all of `supabase/schema.sql` and click **Run**.
2. **Supabase → Authentication → URL Configuration**: set **Site URL** to your Vercel address (e.g. `https://wishlylist.vercel.app`) and add the same address under **Redirect URLs**.
3. **Vercel → Add New → Project**: import this GitHub repository. Under **Environment Variables** add:
   - `SUPABASE_URL` — Supabase → Project Settings → API → Project URL
   - `SUPABASE_ANON_KEY` — Supabase → Project Settings → API → `anon` `public` key
   - `APP_NAME` — `Wishlylist` (optional; that is already the default)
4. Click **Deploy**.

Never put the `service_role` / secret key in the code. It belongs only in Vercel's settings (server-side), for iPhone sharing.

## Screenshot reading and iPhone sharing (optional, pay-per-use)
1. Supabase → SQL Editor: run `supabase/update-2-screenshots.sql` (already included in `schema.sql` for new setups).
2. Vercel → Settings → Environment Variables, add:
   - `ANTHROPIC_API_KEY` — from platform.claude.com → API Keys (needs prepaid credit)
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Project Settings → API Keys → secret key (only needed for iPhone sharing)
   - optional: `LOOKUP_DAILY_LIMIT` (default 20 per person per day), `LOOKUP_ALLOWED_EMAILS`, `CLAUDE_MODEL` (default `claude-sonnet-5-5`)
3. Vercel → Deployments → ⋯ → Redeploy.
4. In the site: ☰ → 📱 iPhone sharing, and follow the steps to make the Shortcut.

## Importing the old Claude list
Signed in, open `https://wishlylist.vercel.app/#/import`, choose `to-go-list-old-items.json`, pick a list and click **Import**. Running it twice doesn't create duplicates.

## Files
- `src/` — the site (plain HTML/CSS/JS, no framework)
- `build.js` — copies `src/` to `public/` and writes `config.js` from the environment variables
- `supabase/schema.sql` — tables, security rules, invite functions and photo storage
