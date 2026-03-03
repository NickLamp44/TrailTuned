// ─── Bike ─────────────────────────────────────────────────────────────────────

export interface Bike {
  id: string
  user_id: string
  brand: string
  model: string
  year: number
  bike_type?: string
  notes?: string
  created_at: string
  updated_at?: string
}

// ─── Setup ────────────────────────────────────────────────────────────────────

export interface SuspensionSetup {
  id: string
  user_id: string
  bike_id: string
  setup_name: string
  version_count: number
  current_version_id?: string
  notes?: string
  created_at: string
  updated_at?: string

  // Fork fields
  fork_component_id?: string
  fork_brand?: string
  fork_model?: string
  fork_year?: number
  fork_hsc?: number
  fork_lsc?: number
  fork_hsr?: number
  fork_lsr?: number
  fork_compression?: number
  fork_rebound?: number
  fork_air_pressure?: number
  fork_ramp_chamber_pressure?: number
  fork_volume_spacers?: number
  fork_spring_rate?: number
  fork_notes?: string

  // Shock fields
  shock_component_id?: string
  shock_brand?: string
  shock_model?: string
  shock_year?: number
  shock_hsc?: number
  shock_lsc?: number
  shock_hsr?: number
  shock_lsr?: number
  shock_compression?: number
  shock_rebound?: number
  shock_air_pressure?: number
  shock_hbo?: number
  shock_volume_spacers?: number
  shock_spring_rate?: number
  shock_notes?: string
}

export interface SetupVersion {
  id: string
  setup_id: string
  user_id: string
  version_number: number
  version_name?: string
  is_manual_snapshot: boolean
  notes?: string
  created_at: string

  // Fork snapshot
  fork_component_id?: string
  fork_brand?: string
  fork_model?: string
  fork_hsc?: number
  fork_lsc?: number
  fork_hsr?: number
  fork_lsr?: number
  fork_compression?: number
  fork_rebound?: number
  fork_air_pressure?: number
  fork_ramp_chamber_pressure?: number
  fork_volume_spacers?: number
  fork_spring_rate?: number
  fork_notes?: string

  // Shock snapshot
  shock_component_id?: string
  shock_brand?: string
  shock_model?: string
  shock_hsc?: number
  shock_lsc?: number
  shock_hsr?: number
  shock_lsr?: number
  shock_compression?: number
  shock_rebound?: number
  shock_air_pressure?: number
  shock_hbo?: number
  shock_volume_spacers?: number
  shock_spring_rate?: number
  shock_notes?: string
  general_notes?: string
}

// ─── Strava / Rides ───────────────────────────────────────────────────────────

export interface StravaTokenResponse {
  token_type: string
  expires_at: number
  expires_in: number
  refresh_token: string
  access_token: string
  athlete: {
    id: number
    firstname: string
    lastname: string
    profile_medium: string
    profile: string
  }
}

export interface StravaActivity {
  id: number
  name: string
  type: string
  distance: number
  elevation_gain: number
  moving_time: number
  start_date: string
  resource_state: number
  average_speed?: number
  max_speed?: number
  map?: {
    summary_polyline?: string
  }
}

export interface StravaTokenRecord {
  id: string
  user_id: string
  access_token: string
  refresh_token: string
  token_expires_at: string
  athlete_id: number
  last_synced_at?: string
}

export interface StravaRide {
  id: string
  user_id: string
  strava_activity_id: number
  activity_name: string
  activity_type: string
  distance_km: number
  elevation_gain_m: number
  moving_time_seconds: number
  activity_date: string
  strava_url: string
  polyline?: string
  avg_speed?: number
  max_speed?: number
  setup_id?: string
  bike_id?: string
  setup_version_id?: string
  bikes?: Pick<Bike, 'brand' | 'model' | 'year'>
  suspension_setups?: Pick<SuspensionSetup, 'setup_name'>
}

// ─── Active Session ───────────────────────────────────────────────────────────

export interface ActiveSetupSession {
  id: string
  user_id: string
  bike_id: string
  setup_id: string
  is_active: boolean
  activated_at: string
  deactivated_at?: string
  bikes?: Pick<Bike, 'brand' | 'model' | 'year'>
  suspension_setups?: Pick<SuspensionSetup, 'setup_name'>
}
