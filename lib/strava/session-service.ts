import { createClient } from "@/lib/supabase/server";
import { stravaRideService } from "./ride-service";

export class SessionService {
  /**
   * Activate a setup for ride tracking
   */
  async activateSetup(userId: string, bikeId: string, setupId: string) {
    const supabase = await createClient();

    // Deactivate any existing sessions
    await supabase
      .from("active_setup_sessions")
      .update({ is_active: false, deactivated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_active", true);

    // Create new session
    const { data, error } = await supabase
      .from("active_setup_sessions")
      .insert({
        user_id: userId,
        bike_id: bikeId,
        setup_id: setupId,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`[v0] Activated setup ${setupId} for user ${userId}`);
    return data;
  }

  /**
   * Deactivate the current session
   */
  async deactivateSession(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("active_setup_sessions")
      .update({ is_active: false, deactivated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error) throw error;

    console.log(`[v0] Deactivated session for user ${userId}`);
  }

  /**
   * Get the currently active session
   */
  async getActiveSession(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("active_setup_sessions")
      .select("*, bikes(brand, model, year), suspension_setups(setup_name)")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw error;
    }

    return data || null;
  }

  /**
   * Sync rides and auto-link to active session
   */
  async syncAndLinkRides(userId: string) {
    try {
      // Sync new rides from Strava
      await stravaRideService.syncUserRides(userId);

      // Get active session
      const activeSession = await this.getActiveSession(userId);
      if (!activeSession) {
        console.log(`[v0] No active session for user ${userId}`);
        return;
      }

      // Get unlinked rides for the active bike
      const supabase = await createClient();
      const { data: unlinkedRides, error } = await supabase
        .from("strava_rides")
        .select("*")
        .eq("user_id", userId)
        .is("setup_id", null)
        .gte(
          "activity_date",
          new Date(activeSession.activated_at).toISOString()
        );

      if (error) throw error;

      // Link recent rides to the active setup
      for (const ride of unlinkedRides || []) {
        // Only auto-link rides within 2 hours of the session activation
        const rideTime = new Date(ride.activity_date).getTime();
        const sessionTime = new Date(activeSession.activated_at).getTime();
        const timeDiffHours =
          Math.abs(rideTime - sessionTime) / (1000 * 60 * 60);

        if (timeDiffHours <= 2) {
          await stravaRideService.linkRideToSetup(
            ride.id,
            activeSession.setup_id,
            activeSession.bike_id
          );
        }
      }

      console.log(
        `[v0] Synced and linked rides for user ${userId} to setup ${activeSession.setup_id}`
      );
    } catch (error) {
      console.error("[v0] Error syncing and linking rides:", error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();
