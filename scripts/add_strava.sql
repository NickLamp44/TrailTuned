-- Strava Integration Tables

-- Store Strava OAuth tokens (one per user)
CREATE TABLE strava_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMP NOT NULL,
  athlete_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cache Strava rides with Trail Tuned linking
CREATE TABLE strava_rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strava_activity_id BIGINT NOT NULL,
  bike_id UUID REFERENCES bikes(id) ON DELETE SET NULL,
  setup_id UUID REFERENCES suspension_setups(id) ON DELETE SET NULL,
  activity_name TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  distance_km NUMERIC,
  elevation_gain_m NUMERIC,
  moving_time_seconds INTEGER,
  activity_date TIMESTAMP NOT NULL,
  strava_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, strava_activity_id)
);

-- Track which setup is currently active for ride tracking
CREATE TABLE active_setup_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  bike_id UUID NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  setup_id UUID NOT NULL REFERENCES suspension_setups(id) ON DELETE CASCADE,
  activated_at TIMESTAMP DEFAULT NOW(),
  deactivated_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_setup_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own Strava tokens"
  ON strava_tokens
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own rides"
  ON strava_rides
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own active sessions"
  ON active_setup_sessions
  FOR ALL
  USING (auth.uid() = user_id);

COMMIT;
