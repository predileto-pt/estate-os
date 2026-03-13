# Predileto Dashboard

Agency portal for managing property visit requests (agendamentos).

## Prerequisites

- Node.js >= 20
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npx supabase --version` to check)
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) project (for Google OAuth)
- A [Resend](https://resend.com) account (for transactional emails)

## 1. Install Dependencies

```bash
npm install
```

## 2. Supabase Setup

### 2.1 Get your Supabase credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open your project
2. Navigate to **Settings > API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (used only for seeding)

### 2.2 Enable Email/Password auth

1. In Supabase, go to **Authentication > Providers**
2. Ensure **Email** is enabled (it is by default)
3. Optionally disable "Confirm email" under **Authentication > Settings** for local development

### 2.3 Link your Supabase project

```bash
npx supabase login          # authenticates with your Supabase account
npx supabase link            # connects to your project (select it from the list)
```

### 2.4 Run database migrations

```bash
npm run db:push
```

This applies all SQL files in `supabase/migrations/` to your remote Supabase database. The CLI tracks which migrations have already been applied, so it's safe to run repeatedly.

## 3. Google OAuth Setup

### 3.1 Create OAuth credentials in Google Cloud

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Choose **Web application**
6. Set the following:
   - **Name**: `Predileto Dashboard` (or any name)
   - **Authorized JavaScript origins**: `http://localhost:3001`
   - **Authorized redirect URIs**: `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
     - Your project ref is in your Supabase URL (e.g. `gwlmwexkvmdmicgkzlds`)
7. Click **Create** and copy the **Client ID** and **Client Secret**

### 3.2 Configure the OAuth consent screen

If you haven't already:

1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type
3. Fill in the required fields (app name, support email)
4. Add scopes: `email`, `profile`, `openid`
5. Add your email as a test user (while in "Testing" mode)
6. Save

### 3.3 Enable Google provider in Supabase

1. In Supabase, go to **Authentication > Providers**
2. Find **Google** and toggle it on
3. Paste the **Client ID** and **Client Secret** from step 3.1
4. Save

## 4. Resend Setup

1. Create an account at [resend.com](https://resend.com)
2. Go to **API Keys** and create a new key
3. Copy the key → `RESEND_API_KEY`
4. To send from a custom domain (e.g. `noreply@predileto.pt`), add and verify your domain under **Domains**
5. For local testing, Resend provides a free sandbox that sends to your own email

## 5. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJ...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_APP_URL=http://localhost:3001
RESEND_API_KEY=re_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SEED_AGENCY_ID=<your-user-uuid>
```

## 6. Start the App

```bash
npm run dev    # starts on http://localhost:3001
```

## 7. Create a User & Seed Data

1. Open `http://localhost:3001` and register a new account
2. In Supabase dashboard, go to **Authentication > Users**
3. Copy your **User UID**
4. Paste it as `SEED_AGENCY_ID` in `.env.local`
5. Run the seed:

```bash
npm run seed
```

This inserts 10 sample visit requests linked to your user account.

## 8. Verify Everything Works

1. Open `http://localhost:3001` — you should be redirected to the login page
2. Log in with your account — you should see the agendamentos list
3. Approve or reject a visit request — the card disappears and an email is sent
4. Click "Sair" (logout) — you should be redirected to login
5. Try the Google OAuth button (if configured)

---

## Database Migrations

Migrations live in `supabase/migrations/` as timestamped SQL files:

```
supabase/migrations/
  20260306000000_create_bookings_table.sql
```

### Commands

| Command | Description |
|---|---|
| `npm run db:push` | Apply pending migrations to the remote database |
| `npm run db:reset` | Reset the remote database and re-run all migrations |
| `npm run db:new <name>` | Create a new empty migration file with timestamp |

### Creating a new migration

```bash
npm run db:new add_notes_column
```

This creates `supabase/migrations/<timestamp>_add_notes_column.sql`. Write your SQL in that file, then apply it:

```bash
npm run db:push
```

## Cypress E2E Tests

End-to-end tests live in `cypress/e2e/` and run against the dev server on `:4000`.

### Configuration

| Setting | Value |
|---|---|
| Base URL | `http://localhost:4000` |
| Spec pattern | `cypress/e2e/**/*.cy.ts` |
| Viewport | 1280 × 720 |
| Retries (CI) | 2 |
| Video | off |

### Environment variables

Tests require a valid Supabase account to authenticate. Set these before running:

```bash
export CYPRESS_TEST_EMAIL=your-test-user@example.com
export CYPRESS_TEST_PASSWORD=your-test-password
```

### Running

```bash
# Start the dev server first
npm run dev

# Interactive mode
npx cypress open

# Headless mode
npx cypress run
```

## Running with properties-searcher

Start both apps side by side:

```bash
# Terminal 1 — properties-searcher on :3000
cd ../properties-searcher && npm run dev

# Terminal 2 — properties-dashboard on :3001
npm run dev
```

The "Imobiliária" link in the searcher nav points to the dashboard.
