# TrailTuned — Monorepo Setup (Phase 1)

This document describes the file moves and terminal commands needed to complete
the Phase 1 monorepo migration in VS Code.

---

## What was created automatically (already done)

```
turbo.json
pnpm-workspace.yaml
packages/types/
packages/utils/
packages/db/
packages/strava/
apps/web/package.json
apps/web/tsconfig.json
apps/web/next.config.mjs
scripts/add-strava-last-synced-at.sql
```

---

## Step 1 — Move the Next.js source files into apps/web

All existing Next.js source files need to move from the repo root into `apps/web/`.
Run these commands from the repo root in VS Code's integrated terminal:

```bash
# Move Next.js source directories
mv app            apps/web/app
mv components     apps/web/components
mv hooks          apps/web/hooks
mv lib            apps/web/lib
mv public         apps/web/public
mv styles         apps/web/styles     # if this folder exists
mv middleware.ts  apps/web/middleware.ts

# Move Next.js config files (the new ones in apps/web/ are the correct versions)
# The root-level copies can be deleted after the move
rm next.config.mjs    # replaced by apps/web/next.config.mjs
rm tsconfig.json      # replaced by apps/web/tsconfig.json

# Move globals.css if it is at root
mv globals.css apps/web/app/globals.css   # skip if already inside app/
```

> Note: `package.json` stays at the root — it is now the monorepo root manifest.
> `apps/web/package.json` is the web app manifest (already written).

---

## Step 2 — Update @/lib imports inside apps/web

After moving files, update the three Supabase import paths inside `apps/web/lib/`:

**apps/web/lib/supabase/client.ts** — replace contents with:
```ts
// Thin re-export: web browser client still uses @supabase/ssr
export { createBrowserClient as createClient } from "@trailtuned/db"
```

**apps/web/lib/supabase/server.ts** — replace contents with:
```ts
// Thin re-export: server client uses next/headers (Next.js only)
export { createClient } from "@trailtuned/db/server"
```

**apps/web/lib/strava/service.ts** — can be deleted; import from `@trailtuned/strava` directly.
**apps/web/lib/strava/ride-service.ts** — can be deleted; import from `@trailtuned/strava` directly.
**apps/web/lib/strava/session-service.ts** — can be deleted; import from `@trailtuned/strava` directly.

> Any component that currently imports from `@/lib/strava/...` should be updated to
> import from `@trailtuned/strava` instead.

---

## Step 3 — Run the database migration

In the Supabase dashboard SQL editor (or via the Supabase CLI), run:
```
scripts/add-strava-last-synced-at.sql
```
This adds the `last_synced_at` column used by the Strava rate-limit guard.

---

## Step 4 — Install dependencies

```bash
# From repo root
pnpm install
```

pnpm will install all workspace dependencies and link the internal packages.

---

## Step 5 — Run the web app

```bash
# From repo root — runs only the web app
pnpm dev:web

# Or, from inside apps/web/
cd apps/web && pnpm dev
```

---

## Folder structure after Phase 1

```
trailtuned/                         ← git root
├── apps/
│   ├── web/                        ← Next.js app (moved here)
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/                    ← thin re-exports only
│   │   ├── public/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── next.config.mjs
│   └── native/                     ← Expo app (Phase 3)
├── packages/
│   ├── types/                      ← shared TypeScript interfaces
│   ├── utils/                      ← cn, formatDate, decodePolyline, etc.
│   ├── db/                         ← Supabase client factories
│   └── strava/                     ← StravaService, RideService, SessionService
├── scripts/
│   └── add-strava-last-synced-at.sql
├── turbo.json
├── pnpm-workspace.yaml
└── package.json                    ← monorepo root (turbo scripts)
```

---

## Phase 2 next steps

Once Phase 1 is verified working:
- Design system reset (NativeWind tokens, new color palette)
- `apps/native/` Expo project bootstrap
