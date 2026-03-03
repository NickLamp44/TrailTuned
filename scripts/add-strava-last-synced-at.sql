-- Migration: add last_synced_at to strava_tokens
-- Fixes the Strava API rate-limit bug where syncUserRides was called on every
-- page load. The column is checked before making any Strava API requests.

ALTER TABLE strava_tokens
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;
