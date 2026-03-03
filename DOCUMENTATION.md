# Trail Tuned — Full Project Documentation

> A full-stack mountain bike suspension tracking web application that lets riders log, manage, version, and compare suspension setups for every bike they own, and link those setups directly to recorded Strava activities.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Environment Variables](#3-environment-variables)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Authentication](#6-authentication)
7. [Feature: Bike Management](#7-feature-bike-management)
8. [Feature: Suspension Setup Tracking](#8-feature-suspension-setup-tracking)
9. [Feature: Setup Version History](#9-feature-setup-version-history)
10. [Feature: Strava Integration](#10-feature-strava-integration)
11. [Feature: Active Setup Sessions](#11-feature-active-setup-sessions)
12. [Feature: Ride History & Maps](#12-feature-ride-history--maps)
13. [Feature: Account Settings](#13-feature-account-settings)
14. [API Routes Reference](#14-api-routes-reference)
15. [Component Reference](#15-component-reference)
16. [Library / Service Reference](#16-library--service-reference)
17. [SQL Migration Scripts](#17-sql-migration-scripts)
18. [Suspension Component Database](#18-suspension-component-database)
19. [Security & Row Level Security](#19-security--row-level-security)
20. [Getting Started (Local Development)](#20-getting-started-local-development)

---

## 1. Project Overview

Trail Tuned is a web app purpose-built for mountain bikers who want to keep an exact record of their suspension settings. The core problem it solves: riders frequently change their fork and shock settings across different trails, weather conditions, and riding styles, but have no easy way to remember what worked where. Trail Tuned provides:

- A structured catalog of every bike the user owns
- Per-bike suspension setups with granular, component-aware fields (HSC, LSC, HSR, LSR, air pressure, volume spacers, spring rate, ramp chamber, HBO, etc.)
- A dynamic form that only shows the adjustment fields that are physically present on the selected component — no irrelevant fields
- Auto-versioning every time a setup is edited, plus manual snapshots, with full restore capability
- Strava OAuth integration to pull in ride history and link specific rides to the setup that was on the bike at the time
- Active session tracking: activate a setup before a ride so Strava activities recorded during that window are automatically linked

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.0.10 |
| Language | TypeScript | ^5 |
| UI Library | React | 19.2.0 |
| Database & Auth | Supabase (PostgreSQL + GoTrue Auth) | `@supabase/supabase-js` latest |
| Supabase SSR Helper | `@supabase/ssr` | 0.8.0 |
| Styling | Tailwind CSS | ^4.1.9 |
| UI Components | shadcn/ui (Radix UI primitives) | various |
| Icons | Lucide React | ^0.454.0 |
| Forms | React Hook Form + Zod | ^7.60.0 / 3.25.76 |
| Charts | Recharts | 2.15.4 |
| Maps | Leaflet (lazy-loaded) | ^1.9.4 |
| Map Tile Source | OpenTopoMap | — |
| Date Formatting | date-fns | 4.1.0 |
| Notifications | Sonner | ^1.7.4 |
| Analytics | Vercel Analytics | 1.3.1 |

---

## 3. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Dev only | Auth redirect URL for local dev (e.g. `http://localhost:3000/dashboard`) |
| `NEXT_PUBLIC_STRAVA_CLIENT_ID` | Strava feature | Strava API application client ID |
| `STRAVA_CLIENT_SECRET` | Strava feature | Strava API application client secret |
| `NEXT_PUBLIC_STRAVA_REDIRECT_URL` | Strava feature | OAuth callback URL (e.g. `https://yourdomain.com/api/auth/strava/callback`) |
| `NEXT_PUBLIC_STRAVA_API_URL` | Optional | Strava API base URL (defaults to `https://www.strava.com/api/v3`) |

---

## 4. Project Structure

```
trail-tuned/
├── app/
│   ├── page.tsx                              # Public landing page
│   ├── layout.tsx                            # Root layout, metadata, fonts
│   ├── globals.css                           # Tailwind v4 theme tokens, global styles
│   ├── auth/
│   │   ├── login/page.tsx                    # Login page
│   │   ├── sign-up/page.tsx                  # Sign-up page
│   │   └── sign-up-success/page.tsx          # Post-signup confirmation
│   ├── dashboard/
│   │   ├── page.tsx                          # Main dashboard (bikes + recent rides)
│   │   ├── bikes/
│   │   │   ├── page.tsx                      # All bikes list
│   │   │   ├── new/page.tsx                  # Add new bike form
│   │   │   └── [bikeId]/
│   │   │       ├── page.tsx                  # Bike detail + setups list
│   │   │       └── setups/
│   │   │           ├── add/page.tsx          # Add new setup for bike
│   │   │           └── [setupId]/
│   │   │               ├── edit/page.tsx     # Edit existing setup
│   │   │               └── history/page.tsx  # Version history for setup
│   │   ├── rides/page.tsx                    # Strava ride history
│   │   └── settings/page.tsx                 # Account & integrations settings
│   ├── api/
│   │   ├── auth/strava/
│   │   │   ├── route.ts                      # Initiate Strava OAuth flow
│   │   │   └── callback/route.ts             # Handle Strava OAuth callback
│   │   ├── strava/
│   │   │   ├── rides/route.ts                # GET synced rides
│   │   │   ├── latest-ride/route.ts          # GET most recent ride
│   │   │   ├── refresh-rides/routes.ts       # POST force re-sync rides
│   │   │   ├── check-connection/route.ts     # GET Strava connection status
│   │   │   ├── disconnect/route.ts           # POST disconnect Strava
│   │   │   └── session/
│   │   │       ├── activate/route.ts         # POST activate setup session
│   │   │       └── deactive/route.ts         # POST deactivate setup session
│   │   └── setups/[setupid]/
│   │       ├── versions/route.ts             # GET all versions of a setup
│   │       └── restore-version/route.ts      # POST restore a specific version
│   └── actions/
│       └── setup-version-actions.ts          # Server Actions for versioning
├── components/
│   ├── dashboard-shell.tsx                   # Authenticated layout wrapper (nav + main)
│   ├── bikes-list.tsx                        # Grid of bike cards on dashboard
│   ├── bike-details.tsx                      # Bike detail header with edit/delete
│   ├── setups-list.tsx                       # List of setups for a specific bike
│   ├── all-setups-list.tsx                   # All setups across all bikes (dashboard)
│   ├── setup-form.tsx                        # Dynamic create/edit suspension setup form
│   ├── adjustment-input.tsx                  # Reusable input for a single adjustment
│   ├── setup-version-history.tsx             # Version history timeline + restore UI
│   ├── add-bike-form.tsx                     # Create new bike form
│   ├── strava-connect.tsx                    # Strava connect/disconnect UI card
│   ├── active-session.tsx                    # Active ride session start/stop card
│   ├── recent-ride-widget.tsx                # Dashboard widget showing most recent ride
│   ├── ride-history.tsx                      # Full paginated ride history list
│   ├── activity-map.tsx                      # Leaflet map rendering a ride polyline
│   ├── change-email-form.tsx                 # Settings: change email address
│   ├── change-password-form.tsx              # Settings: change password
│   ├── delete-account-section.tsx            # Settings: delete account
│   └── ui/                                   # shadcn/ui component library
├── lib/
│   ├── utils.ts                              # cn() helper, formatDate utility
│   ├── setup-version-service.ts              # SetupVersionService class
│   └── strava/
│       ├── service.ts                        # StravaService (OAuth, token mgmt, API calls)
│       ├── ride-service.ts                   # StravaRideService (sync, link, query rides)
│       └── session-service.ts               # SessionService (activate/deactivate sessions)
├── scripts/                                  # SQL migration scripts (run in Supabase)
│   ├── 001_create_tables.sql
│   ├── 002_suspension_components.sql
│   ├── 003_add_damper_variants.sql
│   ├── 004_comprehensive_components.sql
│   ├── 005_update_fox.sql
│   ├── 006_update_Rockshox.sql
│   ├── 006_update_cane.sql
│   ├── 006_update_ohlins.sql
│   ├── add_strava.sql
│   ├── fox/fox.sql
│   ├── ohlins/ohlins.sql
│   ├── caneCreek/caneCreek.sql
│   └── rockshox/
│       ├── rockshox.sql
│       ├── forks/  (boXXer, lyrik, pike, sid, sid-sl, zeb)
│       └── shocks/ (sidLuxe, superDeluxe, vividAir, vividCoil)
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── proxy.ts                                  # Next.js 16 proxy (middleware)
├── next.config.mjs
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

---

## 5. Database Schema

All tables live in the `public` schema of a Supabase (PostgreSQL) project. Row Level Security is enabled on every table.

### `bikes`

Stores the user's bicycle inventory.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated primary key |
| `user_id` | UUID (FK → auth.users) | Owner of the bike |
| `brand` | TEXT | Bike manufacturer (e.g. Trek, Santa Cruz) |
| `model` | TEXT | Model name (e.g. Slash, Bronson) |
| `year` | INTEGER | Model year |
| `frame_details` | TEXT | Optional: frame size, color, notes |
| `active_setup_id` | UUID (FK → suspension_setups) | Which setup is currently active on this bike |
| `created_at` | TIMESTAMPTZ | Record creation time |
| `updated_at` | TIMESTAMPTZ | Last update time |

### `suspension_setups`

Stores individual suspension configurations linked to a bike.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated primary key |
| `bike_id` | UUID (FK → bikes) | The bike this setup belongs to |
| `user_id` | UUID (FK → auth.users) | Owner |
| `setup_name` | TEXT | User-given name (e.g. "Park Day", "All Mountain") |
| `fork_component_id` | UUID (FK → suspension_components) | Selected fork from the component catalog |
| `fork_brand` | TEXT | Denormalized fork brand name |
| `fork_model` | TEXT | Denormalized fork model name |
| `fork_hsc` | INTEGER | High Speed Compression clicks |
| `fork_lsc` | INTEGER | Low Speed Compression clicks |
| `fork_hsr` | INTEGER | High Speed Rebound clicks |
| `fork_lsr` | INTEGER | Low Speed Rebound clicks |
| `fork_compression` | INTEGER | Single compression adjustment (if no HSC/LSC split) |
| `fork_rebound` | INTEGER | Single rebound adjustment |
| `fork_air_pressure` | DECIMAL(5,1) | Air spring pressure in PSI |
| `fork_ramp_chamber_pressure` | DECIMAL(5,1) | Ramp control chamber PSI (e.g. Fox FIT4 Grip2) |
| `fork_volume_spacers` | INTEGER | Number of volume spacers fitted |
| `fork_spring_rate` | DECIMAL(6,2) | Coil spring rate (lb/in) |
| `fork_notes` | TEXT | Free-text notes for the fork |
| `shock_component_id` | UUID (FK → suspension_components) | Selected shock from the component catalog |
| `shock_brand` | TEXT | Denormalized shock brand |
| `shock_model` | TEXT | Denormalized shock model |
| `shock_hsc` | INTEGER | High Speed Compression |
| `shock_lsc` | INTEGER | Low Speed Compression |
| `shock_hsr` | INTEGER | High Speed Rebound |
| `shock_lsr` | INTEGER | Low Speed Rebound |
| `shock_compression` | INTEGER | Single compression knob |
| `shock_rebound` | INTEGER | Single rebound knob |
| `shock_air_pressure` | DECIMAL(5,1) | Air spring PSI |
| `shock_hbo` | DECIMAL(5,1) | Hydraulic Bottom Out (HBO) setting |
| `shock_ramp_chamber_pressure` | DECIMAL(5,1) | Ramp chamber PSI |
| `shock_volume_spacers` | INTEGER | Volume spacers |
| `shock_spring_rate` | DECIMAL(6,2) | Coil spring rate |
| `shock_notes` | TEXT | Free-text notes for the shock |
| `notes` | TEXT | General setup notes |
| `version_count` | INTEGER | Total number of versions ever saved |
| `current_version_id` | UUID (FK → setup_versions) | Pointer to the latest version record |
| `created_at` | TIMESTAMPTZ | — |
| `updated_at` | TIMESTAMPTZ | — |

### `suspension_components`

Pre-populated catalog of real suspension components. Queried by the setup form to drive the Brand → Year → Model selectors and determine which adjustment fields are available.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | — |
| `brand` | TEXT | e.g. Fox, RockShox, Ohlins, Cane Creek |
| `model` | TEXT | e.g. 36 Factory, ZEB Ultimate |
| `year` | INTEGER | Model year |
| `component_type` | TEXT | `'fork'` or `'shock'` |
| `damper_variant` | TEXT | e.g. `'GRIP2'`, `'Charger3'` |
| `damper_name` | TEXT | Human-readable damper name |
| `spring_type` | TEXT | `'air'` or `'coil'` |
| `available_adjustments` | JSONB | Boolean flags for each adjustment type (see below) |

#### `available_adjustments` JSONB structure

```json
{
  "hsc": true,
  "lsc": true,
  "hsr": true,
  "lsr": true,
  "compression": false,
  "rebound": false,
  "air_pressure": true,
  "volume_spacers": true,
  "spring_rate": false,
  "has_ramp_chamber": true,
  "has_hbo": false
}
```

The setup form reads this JSON and conditionally renders each input. If `hsc` and `lsc` are both `true`, separate HSC/LSC fields are shown. If only `compression` is `true`, a single combined knob field is shown instead.

### `setup_versions`

Immutable snapshot of every state a setup has ever been in. A new record is inserted every time a setup is saved (edit), and optionally on user-initiated manual snapshots.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | — |
| `setup_id` | UUID (FK → suspension_setups) | Parent setup |
| `user_id` | UUID (FK → auth.users) | Owner |
| `version_number` | INTEGER | Incrementing integer, starts at 1 |
| `version_name` | TEXT | Optional human label for manual snapshots |
| `notes` | TEXT | Auto-generated or user-provided change notes |
| `is_manual_snapshot` | BOOLEAN | `true` if user explicitly triggered snapshot |
| All fork/shock fields | — | Full copy of every suspension setting at time of save |
| `general_notes` | TEXT | Copy of the setup's general notes |
| `created_at` | TIMESTAMPTZ | When this version was created |

### `strava_tokens`

OAuth tokens for each user's connected Strava account.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | — |
| `user_id` | UUID (UNIQUE FK → auth.users) | One token set per user |
| `access_token` | TEXT | Strava API access token |
| `refresh_token` | TEXT | Used to refresh expired access tokens |
| `token_expires_at` | TIMESTAMP | Expiry; tokens are refreshed if within 5 minutes |
| `athlete_id` | BIGINT | Strava athlete ID |
| `created_at` | TIMESTAMP | — |
| `updated_at` | TIMESTAMP | — |

### `strava_rides`

Cached ride data synced from the Strava API, optionally linked to a setup.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | — |
| `user_id` | UUID (FK → auth.users) | Owner |
| `strava_activity_id` | BIGINT | Strava's own activity ID (UNIQUE per user) |
| `bike_id` | UUID (FK → bikes, nullable) | Linked bike |
| `setup_id` | UUID (FK → suspension_setups, nullable) | Linked suspension setup |
| `activity_name` | TEXT | Activity title from Strava |
| `activity_type` | TEXT | e.g. `Ride`, `MountainBikeRide` |
| `distance_km` | NUMERIC | Distance in kilometres |
| `elevation_gain_m` | NUMERIC | Elevation gain in metres |
| `moving_time_seconds` | INTEGER | Moving time |
| `activity_date` | TIMESTAMP | Start date/time |
| `strava_url` | TEXT | Deep link to Strava activity page |
| `polyline` | TEXT | Encoded Google polyline for map rendering |
| `avg_speed` | NUMERIC | Average speed in km/h |
| `max_speed` | NUMERIC | Max speed in km/h |

### `active_setup_sessions`

Tracks which setup is currently "active" for a user so that incoming rides can be auto-linked.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | — |
| `user_id` | UUID (UNIQUE FK → auth.users) | Only one active session per user |
| `bike_id` | UUID (FK → bikes) | — |
| `setup_id` | UUID (FK → suspension_setups) | The setup being tracked |
| `activated_at` | TIMESTAMP | When the session was started |
| `deactivated_at` | TIMESTAMP | When it was ended (nullable while active) |
| `is_active` | BOOLEAN | `true` while session is running |

---

## 6. Authentication

Trail Tuned uses **Supabase Auth** (GoTrue) with email/password. The `@supabase/ssr` package is used so auth state is handled server-side via HTTP-only cookies.

### Flow

1. User visits `/auth/sign-up`, fills in email and password.
2. Supabase sends a verification email. User is redirected to `/auth/sign-up-success`.
3. User clicks the email link. Supabase redirects to the configured `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (dashboard in production, `localhost:3000/dashboard` in dev).
4. Every protected route calls `supabase.auth.getUser()` on the server. If the user is not authenticated, they are redirected to `/auth/login`.
5. Logout is handled client-side by calling `supabase.auth.signOut()` and then routing to `/auth/login`.

### Supabase Clients

| File | Purpose |
|---|---|
| `lib/supabase/server.ts` | Creates a server-side Supabase client using `@supabase/ssr` `createServerClient`. Used in RSC pages, Server Actions, and API routes. |
| `lib/supabase/client.ts` | Creates a browser-side Supabase client using `@supabase/ssr` `createBrowserClient`. Used in client components. |
| `lib/supabase/proxy.ts` | Supabase proxy configuration for Next.js 16 middleware. |

---

## 7. Feature: Bike Management

### Pages

- **`/dashboard`** — Shows all bikes in a card grid (`BikesList`) and recent Strava rides.
- **`/dashboard/bikes`** — Dedicated bikes list page.
- **`/dashboard/bikes/new`** — Form to add a new bike (`AddBikeForm`).
- **`/dashboard/bikes/[bikeId]`** — Detail page for a specific bike (`BikeDetails` + `SetupsList`).

### Data Model

Bikes store: `brand`, `model`, `year`, `frame_details` (size, color, etc.), and a reference to the `active_setup_id` (the setup currently marked active on that bike).

### Components

#### `BikesList`
Renders a responsive card grid of all the user's bikes. Each card shows brand, model, year, and a link to the bike detail page. Includes an "Add New Bike" button.

#### `BikeDetails`
Displays the header section of the bike detail page with the full bike name, year, and frame details. Provides Edit and Delete actions. Delete uses an alert dialog with confirmation before calling Supabase to delete the bike record (cascade-deletes all associated setups).

#### `AddBikeForm`
A controlled form with fields for:
- Brand (text input)
- Model (text input)
- Year (number input)
- Frame Details (textarea, optional)

On submit, inserts a new row into the `bikes` table and redirects to the new bike's detail page.

---

## 8. Feature: Suspension Setup Tracking

This is the core feature of Trail Tuned.

### Pages

- **`/dashboard/bikes/[bikeId]/setups/add`** — Create a new setup.
- **`/dashboard/bikes/[bikeId]/setups/[setupId]/edit`** — Edit an existing setup.

### The Dynamic Setup Form (`SetupForm`)

The `SetupForm` component is the most complex piece of the application. It handles both create and edit modes via a single `setupId` prop (if present = editing).

#### Component Selection (Brand → Year → Model)

The form loads all records from `suspension_components` on mount. Fork and shock sections are independently collapsible — each defaults to collapsed (not added) until the user clicks "Add Fork" or "Add Shock".

Once a section is expanded, three cascading selects appear:

1. **Brand** — filters all available brands for that component type
2. **Year** — filtered by selected brand, sorted descending (newest first)
3. **Model** — filtered by brand + year, including damper variant if present

When all three are selected, the matching `SuspensionComponent` record is loaded. Its `available_adjustments` JSONB field determines exactly which input fields to render below.

#### Conditional Adjustment Fields

| Field | Condition to Show |
|---|---|
| HSC (High Speed Compression) | `available_adjustments.hsc === true` |
| LSC (Low Speed Compression) | `available_adjustments.lsc === true` |
| Compression (single knob) | `available_adjustments.compression === true` |
| HSR (High Speed Rebound) | `available_adjustments.hsr === true` |
| LSR (Low Speed Rebound) | `available_adjustments.lsr === true` |
| Rebound (single knob) | `available_adjustments.rebound === true` |
| Air Pressure (PSI) | `available_adjustments.air_pressure === true` |
| Ramp Chamber Pressure | `available_adjustments.has_ramp_chamber === true` |
| Volume Spacers | `available_adjustments.volume_spacers === true` |
| Spring Rate | `available_adjustments.spring_rate === true` |
| HBO (Hydraulic Bottom Out) | `available_adjustments.has_hbo === true` (shock only) |

#### AdjustmentInput Component

A reusable wrapper around a labeled number input field. Used for every individual adjustment (HSC, LSC, PSI, etc.). Accepts `label`, `value`, `onChange`, `placeholder`, `unit`, and optional `hint` props.

#### Save Behavior

- **Create**: inserts a new `suspension_setups` row and redirects to the bike detail page.
- **Edit**: updates the existing row, then automatically calls `createSetupVersionAction` to snapshot the new state as a new version.

---

## 9. Feature: Setup Version History

Every time a setup is edited and saved, the entire setup state is automatically saved as a new immutable version record in `setup_versions`. Users can also view the history and restore any prior version.

### Page

- **`/dashboard/bikes/[bikeId]/setups/[setupId]/history`** — Lists all versions with a restore button on each past version.

### SetupVersionService (`lib/setup-version-service.ts`)

A service class with the following methods:

| Method | Description |
|---|---|
| `createVersion(setupId, userId, setupData, notes?, isManualSnapshot?)` | Inserts a new version record, increments `version_count` on the parent setup, and updates `current_version_id`. |
| `createManualSnapshot(setupId, userId, snapshotName?, notes?)` | Fetches the current setup state and calls `createVersion` with `isManualSnapshot: true`. |
| `getSetupVersions(setupId, userId)` | Returns all versions for a setup, ordered newest first. |
| `getVersion(versionId, userId)` | Returns a single version record. |
| `restoreVersion(setupId, userId, versionIdToRestore)` | Reads the target version's settings, updates the parent `suspension_setups` row with those values, and creates a new version record with a note like "Restored from version N". |
| `getRidesForVersion(versionId, userId)` | Returns all Strava rides linked to a specific version. |

### Version Display (`SetupVersionHistory` component)

- Lists versions newest-first in card form
- Current (latest) version is highlighted with a `Current` badge
- Manual snapshots show a `Snapshot` badge
- Each past version shows a full breakdown of all recorded fork and shock settings
- Each past version has a **Restore** button that calls `POST /api/setups/[setupId]/restore-version`

### Server Action (`app/actions/setup-version-actions.ts`)

`createSetupVersionAction` is a Next.js Server Action called directly from the client-side `SetupForm` after a successful update. It authenticates the user, then delegates to `setupVersionService.createVersion()`.

---

## 10. Feature: Strava Integration

Trail Tuned integrates with the Strava API v3 using OAuth 2.0 to pull in a user's ride history.

### OAuth Flow

1. User clicks "Connect with Strava" (`StravaConnect` component → `GET /api/auth/strava`).
2. The API route builds a Strava authorization URL via `StravaService.getAuthUrl()` with scopes `read,activity:read_all` and redirects the user.
3. Strava redirects back to `GET /api/auth/strava/callback?code=...&state=...`.
4. The callback route calls `StravaService.exchangeCodeForToken(code)` to get access + refresh tokens.
5. Tokens are stored in the `strava_tokens` table via `StravaService.saveTokens()`.
6. User is redirected to `/dashboard/rides`.

### Token Management

The `StravaService.getValidAccessToken(userId)` method:
- Fetches stored tokens from `strava_tokens`
- Checks if the access token expires within 5 minutes
- If so, calls `refreshAccessToken()` to get a new token and saves it back
- Returns the valid access token

### Disconnect

`POST /api/strava/disconnect` calls `StravaRideService.disconnectAccount()` which:
1. Deletes all cached rides from `strava_rides` for the user
2. Deletes the token record from `strava_tokens`

### StravaConnect Component

Rendered in both the **Rides** page and the **Settings** page. Checks connection status on mount via `GET /api/strava/check-connection`. Shows a green "connected" state or an orange "Connect with Strava" button depending on status.

---

## 11. Feature: Active Setup Sessions

Active sessions allow automatic ride-to-setup linking. When a user activates a setup before going riding, any Strava activity recorded during that session window gets linked to that setup automatically.

### Flow

1. User navigates to a bike's setups list and clicks "Start Tracking" on a setup (`ActiveSession` component).
2. `POST /api/strava/session/activate` is called with `bikeId` and `setupId`.
3. The `SessionService.activateSetup()` method:
   - Deactivates any existing active sessions for the user
   - Inserts a new `active_setup_sessions` record with `is_active: true`
4. When rides are synced (on any `/api/strava/rides` request), `SessionService.syncAndLinkRides()` runs:
   - Syncs latest rides from Strava
   - Finds the user's active session
   - Finds any rides with `setup_id = null` that were recorded after `activated_at`
   - Auto-links rides that happened within **2 hours** of session activation
5. User clicks "Stop Tracking" → `POST /api/strava/session/deactivate` sets `is_active: false` and sets `deactivated_at`.

### ActiveSession Component

Accepts `bikeId`, `setupId`, `setupName`, `bikeName`, and `isActive` props. Renders a different card UI depending on whether a session is active:
- **Active**: green `Active` badge, shows setup and bike name, "Stop Tracking" button
- **Inactive with setup selected**: "Start Tracking" button with setup name displayed
- **No setup selected**: informational message explaining how to begin

---

## 12. Feature: Ride History & Maps

### Page: `/dashboard/rides`

Shows the `RideHistory` component (full paginated list) and the `StravaConnect` widget below it.

### RideHistory Component

- Fetches rides from `GET /api/strava/rides?page=N&limit=20`
- Each request triggers a Strava sync (`stravaRideService.syncUserRides()`) before returning cached data, so the list is always up to date
- Renders a card per ride showing:
  - Activity name and date
  - Duration (formatted as `Xh Ym`)
  - Distance (km)
  - Elevation gain (m)
  - Activity type
  - Linked setup name (badge) or "Not linked" indicator
  - Linked bike name if present
  - Route map if polyline data is available
  - External link to the activity on Strava

#### Sync Logic

`StravaRideService.syncUserRides()`:
1. Fetches the latest 50 activities from Strava
2. Filters to only `Ride` and `MountainBikeRide` types
3. For each activity, fetches the full activity detail (includes polyline)
4. Upserts into `strava_rides` (UNIQUE on `user_id + strava_activity_id`)
5. Handles Strava rate limiting: inserts a 150ms delay between requests, stops early if a 429 is returned
6. Converts speeds from m/s to km/h

### ActivityMap Component

A lazy-loaded Leaflet map rendered inside each ride card when `polyline` data is available.

- Decodes Google Encoded Polyline format into `[lat, lng]` coordinate arrays
- Uses OpenTopoMap tiles (grayscale filtered via CSS for UI consistency)
- Draws the route as an orange (`#ea580c`) polyline
- Places a green circle marker at the start and a red circle marker at the end
- Auto-fits the map bounds to the route with 20px padding
- Map instances are cleaned up on component unmount to prevent Leaflet memory leaks

### RecentRideWidget Component

A compact widget on the main dashboard showing the user's most recent Strava ride with key stats. Fetches from `GET /api/strava/latest-ride`.

---

## 13. Feature: Account Settings

**Page: `/dashboard/settings`**

Provides three account management capabilities and the Strava integration card.

### ChangeEmailForm

- Calls `supabase.auth.updateUser({ email: newEmail })` which sends a confirmation email to the new address
- Validates that the new email differs from the current one

### ChangePasswordForm

- Calls `supabase.auth.updateUser({ password: newPassword })` with a confirmation field
- Client-side validation ensures password and confirmation match

### DeleteAccountSection

- Displays a danger-zone styled section
- Uses an alert dialog with confirmation text before deleting
- On confirm, deletes the user from the Supabase auth system and cascades all data via database FK `ON DELETE CASCADE` rules

### StravaConnect (in Settings)

Same component as used in the Rides page, embedded inside a Card here for quick access to connect or disconnect.

---

## 14. API Routes Reference

All routes are under `app/api/`. They all require an authenticated session (verified via `supabase.auth.getUser()`).

### Strava Auth

| Method | Route | Description |
|---|---|---|
| GET | `/api/auth/strava` | Generates Strava OAuth URL and redirects |
| GET | `/api/auth/strava/callback` | Handles OAuth code exchange, saves tokens, redirects to `/dashboard/rides` |

### Strava Operations

| Method | Route | Description |
|---|---|---|
| GET | `/api/strava/rides?page=N&limit=N` | Syncs then returns paginated cached rides with bike and setup info |
| GET | `/api/strava/latest-ride` | Returns the single most recent ride |
| POST | `/api/strava/refresh-rides` | Force-syncs rides from Strava |
| GET | `/api/strava/check-connection` | Returns `{ connected: boolean }` |
| POST | `/api/strava/disconnect` | Deletes tokens and ride cache |
| POST | `/api/strava/session/activate` | Body: `{ bikeId, setupId }`. Starts a tracking session. |
| POST | `/api/strava/session/deactive` | Ends the current tracking session. |

### Setup Versioning

| Method | Route | Description |
|---|---|---|
| GET | `/api/setups/[setupId]/versions` | Returns all versions for a setup |
| POST | `/api/setups/[setupId]/restore-version` | Body: `{ versionId }`. Restores a version and creates a new version record. |

---

## 15. Component Reference

| Component | Type | Description |
|---|---|---|
| `DashboardShell` | Client | Sticky nav header (logo, My Bikes, Rides, Settings, user email, logout) wrapping a max-w-7xl content area |
| `BikesList` | Server-rendered props | Card grid of bikes with add button |
| `BikeDetails` | Client | Bike name/details header, edit/delete actions |
| `SetupsList` | Client | List of suspension setups for one bike; shows active setup badge, edit/history/delete actions per setup |
| `AllSetupsList` | Client | Flat list of all setups across all bikes shown on the main dashboard |
| `SetupForm` | Client | Full dynamic create/edit form with cascading component selectors and conditional adjustment fields |
| `AdjustmentInput` | Client | Labeled numeric input with unit display |
| `SetupVersionHistory` | Client | Version timeline with restore actions |
| `AddBikeForm` | Client | Simple form to create a new bike |
| `StravaConnect` | Client | Connect/disconnect Strava card |
| `ActiveSession` | Client | Start/stop ride tracking session card |
| `RideHistory` | Client | Paginated ride list with maps |
| `RecentRideWidget` | Client | Single latest-ride summary card |
| `ActivityMap` | Client | Leaflet map for a ride polyline |
| `ChangeEmailForm` | Client | Email update form |
| `ChangePasswordForm` | Client | Password update form |
| `DeleteAccountSection` | Client | Danger zone delete account with confirmation dialog |

---

## 16. Library / Service Reference

### `StravaService` (`lib/strava/service.ts`)

Handles all direct communication with the Strava API v3.

| Method | Description |
|---|---|
| `getAuthUrl(state)` | Returns the full Strava authorization URL |
| `exchangeCodeForToken(code)` | POST to Strava token endpoint with authorization code |
| `refreshAccessToken(refreshToken)` | POST to Strava token endpoint with refresh token |
| `getActivities(accessToken, options?)` | GET athlete activities (paginated, filterable by date range) |
| `getActivity(accessToken, activityId)` | GET a single full activity (includes polyline) |
| `saveTokens(userId, tokenData)` | Upserts to `strava_tokens` table |
| `getTokens(userId)` | Reads from `strava_tokens` table |
| `getValidAccessToken(userId)` | Returns a valid (auto-refreshed if near-expiry) access token |
| `disconnectAccount(userId)` | Deletes from `strava_tokens` table |

### `StravaRideService` (`lib/strava/ride-service.ts`)

Manages syncing and querying ride data.

| Method | Description |
|---|---|
| `syncUserRides(userId)` | Syncs latest 50 MTB activities from Strava into `strava_rides` |
| `getLatestRide(userId)` | Returns the most recent ride from cache |
| `getUserRides(userId, options?)` | Paginated query of rides with joined bike/setup data |
| `linkRideToSetup(rideId, setupId, bikeId)` | Updates `setup_id` and `bike_id` on a ride |
| `unlinkRideFromSetup(rideId)` | Nulls `setup_id` and `bike_id` on a ride |
| `isConnected(userId)` | Boolean check for whether Strava is connected |
| `disconnectAccount(userId)` | Deletes rides cache + delegates to `StravaService.disconnectAccount()` |

### `SessionService` (`lib/strava/session-service.ts`)

Manages the active tracking session lifecycle.

| Method | Description |
|---|---|
| `activateSetup(userId, bikeId, setupId)` | Deactivates old sessions, creates new active session |
| `deactivateSession(userId)` | Marks active session as inactive |
| `getActiveSession(userId)` | Returns current active session with joined bike/setup names |
| `syncAndLinkRides(userId)` | Syncs rides then auto-links those within 2h of session start |

### `SetupVersionService` (`lib/setup-version-service.ts`)

Full versioning system for suspension setups.

| Method | Description |
|---|---|
| `createVersion(...)` | Inserts version snapshot, increments counter, updates pointer |
| `createManualSnapshot(...)` | Fetches current state then calls `createVersion` |
| `getSetupVersions(setupId, userId)` | Returns all versions sorted newest first |
| `getVersion(versionId, userId)` | Returns one version |
| `restoreVersion(setupId, userId, versionIdToRestore)` | Applies old version's settings to current setup, records new version |
| `getRidesForVersion(versionId, userId)` | Returns rides linked to a version |

---

## 17. SQL Migration Scripts

Run these in order in the Supabase SQL Editor to build the full schema:

| Script | Purpose |
|---|---|
| `001_create_tables.sql` | Creates `bikes` and `suspension_setups` with RLS policies and indexes |
| `002_suspension_components.sql` | Creates `suspension_components` table |
| `003_add_damper_variants.sql` | Adds `damper_variant` and `damper_name` columns |
| `004_comprehensive_components.sql` | Bulk-inserts initial component data |
| `005_update_fox.sql` | Updates/adds Fox suspension component data |
| `006_update_Rockshox.sql` | Updates/adds RockShox component data |
| `006_update_cane.sql` | Updates/adds Cane Creek component data |
| `006_update_ohlins.sql` | Updates/adds Ohlins component data |
| `add_strava.sql` | Creates `strava_tokens`, `strava_rides`, `active_setup_sessions` with RLS |
| `fox/fox.sql` | Comprehensive Fox component catalog |
| `ohlins/ohlins.sql` | Comprehensive Ohlins component catalog |
| `caneCreek/caneCreek.sql` | Comprehensive Cane Creek component catalog |
| `rockshox/rockshox.sql` | RockShox shared seed data |
| `rockshox/forks/boXXer.sql` | RockShox BoXXer fork variants |
| `rockshox/forks/lyrik.sql` | RockShox Lyrik fork variants |
| `rockshox/forks/pike.sql` | RockShox Pike fork variants |
| `rockshox/forks/sid.sql` | RockShox SID fork variants |
| `rockshox/forks/sid-sl.sql` | RockShox SID SL fork variants |
| `rockshox/forks/zeb.sql` | RockShox ZEB fork variants |
| `rockshox/shocks/sidLuxe.sql` | RockShox SIDLuxe shock variants |
| `rockshox/shocks/superDeluxe.sql` | RockShox Super Deluxe shock variants |
| `rockshox/shocks/vividAir.sql` | RockShox Vivid Air shock variants |
| `rockshox/shocks/vividCoil.sql` | RockShox Vivid Coil shock variants |

---

## 18. Suspension Component Database

The `suspension_components` table contains 200+ real-world suspension components from four brands. Each entry includes accurate `available_adjustments` flags so the setup form only shows relevant fields.

### Supported Brands

| Brand | Forks | Shocks |
|---|---|---|
| **Fox** | 34, 36, 38, 40, Float, Factory, Performance, Rhythm | Float DPS, DPX2, DHX2, X2, Van, coil variants |
| **RockShox** | SID, SID SL, Pike, Lyrik, ZEB, BoXXer | SIDLuxe, Super Deluxe, Vivid Air, Vivid Coil |
| **Ohlins** | RXF, RFX | TTX, STX |
| **Cane Creek** | Helm, Helm MkII | DB, DB Air, DB Coil, Kitsuma |

### Damper Variants

Many models have multiple damper options that affect available adjustments. These are tracked via `damper_variant` and `damper_name`. For example:

- RockShox Pike with `Charger2.1 RC2` → HSC + LSC + HSR + LSR
- RockShox Pike with `Charger2.1 RCT3` → HSC + LSC + HSR + LSR + lockout
- Fox 36 with `GRIP2` → HSC + LSC + HSR + LSR + ramp chamber
- Fox 36 with `GRIP` → compression + rebound only

---

## 19. Security & Row Level Security

All database tables use Supabase RLS policies. The pattern is consistent across all tables:

```sql
-- Every table follows this pattern:
CREATE POLICY "Users can view their own data"
  ON public.<table_name> FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data"
  ON public.<table_name> FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data"
  ON public.<table_name> FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data"
  ON public.<table_name> FOR DELETE
  USING (auth.uid() = user_id);
```

This means even if an API call were to attempt to read another user's data by guessing a UUID, Supabase's RLS layer would return zero rows.

The `suspension_components` table is read-only public data (the component catalog) and does not have user-scoped RLS — it is readable by all authenticated users but only writable by service role (admin seeding scripts).

Server-side API routes independently verify `supabase.auth.getUser()` before performing any operation, providing defense-in-depth beyond RLS alone.

---

## 20. Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- pnpm (the repo uses `pnpm-lock.yaml`)
- A Supabase project

### Installation

```bash
# Clone the repository
git clone https://github.com/NickLamp44/TrailTuned.git
cd TrailTuned

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local
# Fill in the values from your Supabase project (Settings → API)
```

### Database Setup

Run the SQL scripts in the Supabase SQL Editor **in order**:

```
001_create_tables.sql
002_suspension_components.sql
003_add_damper_variants.sql
004_comprehensive_components.sql
005_update_fox.sql
006_update_Rockshox.sql
006_update_cane.sql
006_update_ohlins.sql
add_strava.sql
fox/fox.sql
ohlins/ohlins.sql
caneCreek/caneCreek.sql
rockshox/rockshox.sql
rockshox/forks/*.sql  (all 6 fork files)
rockshox/shocks/*.sql (all 4 shock files)
```

### Strava Setup (optional)

1. Go to [strava.com/settings/api](https://www.strava.com/settings/api) and create an application
2. Set the authorization callback domain to `localhost` for development
3. Add `NEXT_PUBLIC_STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, and `NEXT_PUBLIC_STRAVA_REDIRECT_URL=http://localhost:3000/api/auth/strava/callback` to `.env.local`

### Run

```bash
pnpm dev
# App available at http://localhost:3000
```

### Deployment

Deploy to Vercel. Add all environment variables in the Vercel project dashboard. The Supabase redirect URL for production should point to your Vercel deployment URL.

---

*Documentation generated for Trail Tuned — NickLamp44/TrailTuned*
