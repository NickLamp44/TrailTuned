import { stravaService } from "./service"

// Sync throttle: only call Strava API if last sync was more than 15 minutes ago.
const SYNC_INTERVAL_MS = 15 * 60 * 1000

export class StravaRideService {
  /**
   * Syncs the user's recent MTB/Ride activities from Strava into strava_rides.
   * Rate-limit guard: skips sync if last_synced_at was < SYNC_INTERVAL_MS ago.
   * Pass force=true to bypass the guard (e.g. manual "Refresh" button).
   */
  async syncUserRides(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string,
    force = false
  ) {
    // ── Rate-limit guard ──────────────────────────────────────────────────────
    if (!force) {
      const { data: tokenRow } = await supabase
        .from("strava_tokens")
        .select("last_synced_at")
        .eq("user_id", userId)
        .single()

      if (tokenRow?.last_synced_at) {
        const lastSync = new Date(tokenRow.last_synced_at).getTime()
        if (Date.now() - lastSync < SYNC_INTERVAL_MS) {
          return 0 // Skip sync — too recent
        }
      }
    }

    const accessToken = await stravaService.getValidAccessToken(supabase, userId)
    const activities = await stravaService.getActivities(accessToken, { per_page: 50 })

    const mtbActivities = activities.filter((a) =>
      ["Ride", "MountainBikeRide"].includes(a.type)
    )

    for (let i = 0; i < mtbActivities.length; i++) {
      const activity = mtbActivities[i]
      try {
        if (i > 0) await new Promise((r) => setTimeout(r, 150))

        const full = await stravaService.getActivity(accessToken, activity.id)

        await supabase.from("strava_rides").upsert({
          user_id: userId,
          strava_activity_id: full.id,
          activity_name: full.name,
          activity_type: full.type,
          distance_km: full.distance / 1000,
          elevation_gain_m: full.elevation_gain,
          moving_time_seconds: full.moving_time,
          activity_date: new Date(full.start_date as string).toISOString(),
          strava_url: `https://www.strava.com/activities/${full.id}`,
          polyline: (full.map as { summary_polyline?: string })?.summary_polyline ?? null,
          avg_speed: full.average_speed ? (full.average_speed as number) * 3.6 : null,
          max_speed: full.max_speed ? (full.max_speed as number) * 3.6 : null,
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes("Too Many Requests") || msg.includes("429")) break
      }
    }

    // Update last_synced_at timestamp
    await supabase
      .from("strava_tokens")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("user_id", userId)

    return mtbActivities.length
  }

  async getLatestRide(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string
  ) {
    const { data, error } = await supabase
      .from("strava_rides")
      .select("*")
      .eq("user_id", userId)
      .order("activity_date", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data ?? null
  }

  async getUserRides(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string,
    options?: { limit?: number; offset?: number; setupId?: string; bikeId?: string }
  ) {
    let query = supabase
      .from("strava_rides")
      .select("*, bikes(brand, model, year), suspension_setups(setup_name)")
      .eq("user_id", userId)

    if (options?.setupId) query = query.eq("setup_id", options.setupId)
    if (options?.bikeId) query = query.eq("bike_id", options.bikeId)

    const { data, error, count } = await query
      .order("activity_date", { ascending: false })
      .range(
        options?.offset ?? 0,
        (options?.offset ?? 0) + (options?.limit ?? 20) - 1
      )

    if (error) throw error
    return { rides: data ?? [], total: count ?? 0 }
  }

  async linkRideToSetup(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    rideId: string,
    setupId: string,
    bikeId: string
  ) {
    const { error } = await supabase
      .from("strava_rides")
      .update({ setup_id: setupId, bike_id: bikeId })
      .eq("id", rideId)
    if (error) throw error
  }

  async unlinkRideFromSetup(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    rideId: string
  ) {
    const { error } = await supabase
      .from("strava_rides")
      .update({ setup_id: null, bike_id: null })
      .eq("id", rideId)
    if (error) throw error
  }

  async isConnected(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string
  ): Promise<boolean> {
    try {
      await stravaService.getTokens(supabase, userId)
      return true
    } catch {
      return false
    }
  }

  async disconnectAccount(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string
  ) {
    await supabase.from("strava_rides").delete().eq("user_id", userId)
    await stravaService.disconnectAccount(supabase, userId)
  }
}

export const stravaRideService = new StravaRideService()
