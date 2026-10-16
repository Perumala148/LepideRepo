# Lepide

React + Vite + TypeScript app with Tailwind CSS, React Router, and Supabase auth.

## Pages

- `/login` — sign in with email + password (Supabase Auth)
- `/register` — create an account; a DB trigger writes a row to the `profiles` table
- `/landing` — protected; lists everyone who has registered (requires sign-in)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Supabase project values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. In the Supabase SQL editor, create the `profiles` table used by the register/landing pages:
   ```sql
   create table public.profiles (
     id uuid primary key references auth.users (id) on delete cascade,
     full_name text not null,
     email text not null,
     created_at timestamptz not null default now()
   );

   alter table public.profiles enable row level security;

   create policy "Public read access" on public.profiles
     for select using (true);

   -- Auto-create a profile row whenever a new auth user signs up. This runs
   -- as the table owner (security definer), so it works even before the new
   -- user has a session/JWT (e.g. while "Confirm email" is pending) and is
   -- never blocked by RLS the way a client-side insert would be.
   create function public.handle_new_user()
   returns trigger
   language plpgsql
   security definer set search_path = public
   as $$
   begin
     insert into public.profiles (id, full_name, email)
     values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
     return new;
   end;
   $$;

   create trigger on_auth_user_created
     after insert on auth.users
     for each row execute function public.handle_new_user();
   ```

   If you already created the `profiles` table and an insert policy from an earlier
   version of this README, you can drop the now-unused insert policy:
   ```sql
   drop policy if exists "Users can insert their own profile" on public.profiles;
   ```
4. In Supabase → Authentication → Providers, keep Email enabled. If you don't want email
   confirmation for this demo, turn off "Confirm email" under Authentication → Settings.
5. Run the dev server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

Output goes to `dist/`. `npm run preview` serves the production build locally.

## Deploy to Vercel

- Framework preset: Vite (auto-detected)
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Environment Variables in the Vercel
  project settings (they must be prefixed `VITE_` to be available in the client bundle).
- `vercel.json` rewrites all routes to `index.html` so client-side routing
  (`/login`, `/register`, `/landing`) works on refresh/direct link.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
