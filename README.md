# To Go List

Places to go, things to buy, services, movies and books — in private, family, friends and public lists.
Sign-in and data: Supabase. Hosting: Vercel. No Claude account needed to use it.

## Lists
- **Private**: only you. Everyone gets one ("My list") when they sign up.
- **Family / Friends**: you create it, then share an invite link (WhatsApp, copy, share). Anyone who opens it, signs in and joins can add, edit and tick off items.
- **Public**: anyone with the link can view it without an account. Only people you invite can edit it.

## One-time setup
1. **Supabase → SQL Editor → New query**: paste all of `supabase/schema.sql` and click **Run**.
2. **Supabase → Authentication → URL Configuration**: set **Site URL** to your Vercel address (e.g. `https://your-app.vercel.app`) and add the same address under **Redirect URLs**.
3. **Vercel → Add New → Project**: import this GitHub repository. Under **Environment Variables** add:
   - `SUPABASE_URL` — Supabase → Project Settings → API → Project URL
   - `SUPABASE_ANON_KEY` — Supabase → Project Settings → API → `anon` `public` key
   - `APP_NAME` — the name shown in the app (optional)
4. Click **Deploy**.

Never put the `service_role` key anywhere in this project.

## Importing the old Claude list
Signed in, open `https://your-app.vercel.app/#/import`, choose `to-go-list-old-items.json`, pick a list and click **Import**. Running it twice doesn't create duplicates.

## Files
- `src/` — the site (plain HTML/CSS/JS, no framework)
- `build.js` — copies `src/` to `public/` and writes `config.js` from the environment variables
- `supabase/schema.sql` — tables, security rules, invite functions and photo storage
