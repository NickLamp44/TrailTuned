import { stravaRideService } from "./ride-service"

export class SessionService {
  async activateSetup(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string,
    bikeId: string,
    setupId: string
  ) {
    // Deactivate any existing sessions first
    await supabase
      .from("active_setup_sessions")
      .update({ is_active: false, deactivated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_active", true)

    const { data, error } = await supabase
      .from("active_setup_sessions")
      .insert({ user_id: userId, bike_id: bikeId, setup_id: setupId, is_active: true })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deactivateSession(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string
  ) {
    const { error } = await supabase
      .from("active_setup_sessions")
      .update({ is_active: false, deactivated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_active", true)
    if (error) throw error
  }

  async getActiveSession(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string
  ) {
    const { data, error } = await supabase
      .from("active_setup_sessions")
      .select("*, bikes(brand, model, year), suspension_setups(setup_name)")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data ?? null
  }

  async syncAndLinkRides(
    supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
    userId: string
  ) {
    await stravaRideService.syncUserRides(supabase, userId)

    const activeSession = await this.getActiveSession(supabase, userId)
    if (!activeSession) return

    const { data: unlinkedRides, error } = await supabase
      .from("strava_rides")
      .select("*")
      .eq("user_id", userId)
      .is("setup_id", null)
      .gte("activity_date", new Date(activeSession.activated_at).toISOString())

    if (error) throw error

    for (const ride of unlinkedRides ?? []) {
      const rideTime = new Date(ride.activity_date).getTime()
      const sessionTime = new Date(activeSession.activated_at).getTime()
      const timeDiffHours = Math.abs(rideTime - sessionTime) / (1000 * 60 * 60)

      if (timeDiffHours <= 2) {
        await stravaRideService.linkRideToSetup(
          supabase,
          ride.id,
          activeSession.setup_id,
          activeSession.bike_id
        )
      }
    }
  }
}

export const sessionService = new SessionService()
