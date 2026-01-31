import { createClient } from "@/lib/supabase/server";
import { stravaService } from "./service";

export class StravaRideService {
  /**
   * Fetch and cache Strava rides for a user
   */
  async syncUserRides(userId: string) {
    try {
      const accessToken = await stravaService.getValidAccessToken(userId);
      const activities = await stravaService.getActivities(accessToken, {
        per_page: 50,
      });

      const supabase = await createClient();

      // Filter for mountain bike rides only
      const mtbActivities = activities.filter((activity) =>
        ["Ride", "MountainBikeRide"].includes(activity.type)
      );

      // Fetch full activity details for each ride to get polyline
      // Add delay between requests to avoid Strava rate limiting
      for (let i = 0; i < mtbActivities.length; i++) {
        const activity = mtbActivities[i];
        try {
          // Add delay before fetching to avoid rate limits (150ms between requests)
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 150));
          }

          // Fetch full activity details which includes polyline
          const fullActivity = await stravaService.getActivity(
            accessToken,
            activity.id
          );

          console.log(
            `[v0] Syncing activity ${
              activity.id
            }, has polyline: ${!!fullActivity.map?.summary_polyline}`
          );

          await supabase.from("strava_rides").upsert({
            user_id: userId,
            strava_activity_id: fullActivity.id,
            activity_name: fullActivity.name,
            activity_type: fullActivity.type,
            distance_km: fullActivity.distance / 1000,
            elevation_gain_m: fullActivity.elevation_gain,
            moving_time_seconds: fullActivity.moving_time,
            activity_date: new Date(fullActivity.start_date).toISOString(),
            strava_url: `https://www.strava.com/activities/${fullActivity.id}`,
            polyline: fullActivity.map?.summary_polyline ?? null,
            avg_speed: fullActivity.average_speed
              ? fullActivity.average_speed * 3.6
              : null,
            max_speed: fullActivity.max_speed
              ? fullActivity.max_speed * 3.6
              : null,
          });
        } catch (activityError) {
          const errorMsg =
            activityError instanceof Error
              ? activityError.message
              : String(activityError);

          // If rate limited, stop syncing to avoid further rate limiting
          if (
            errorMsg.includes("Too Many Requests") ||
            errorMsg.includes("429")
          ) {
            console.log("[v0] Strava rate limit reached, stopping sync");
            break;
          }

          console.error(
            `[v0] Error fetching details for activity ${activity.id}:`,
            activityError
          );
          // Continue with next activity for other errors
        }
      }

      console.log(
        `[v0] Synced ${mtbActivities.length} mountain bike rides for user ${userId}`
      );
      return mtbActivities.length;
    } catch (error) {
      console.error("[v0] Error syncing Strava rides:", error);
      throw error;
    }
  }

  /**
   * Get the most recent mountain bike ride for a user
   */
  async getLatestRide(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("strava_rides")
      .select("*")
      .eq("user_id", userId)
      .order("activity_date", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw error;
    }

    return data || null;
  }

  /**
   * Get all rides for a user with optional filters
   */
  async getUserRides(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      setupId?: string;
      bikeId?: string;
    }
  ) {
    const supabase = await createClient();

    let query = supabase
      .from("strava_rides")
      .select("*, bikes(brand, model, year), suspension_setups(setup_name)")
      .eq("user_id", userId);

    if (options?.setupId) {
      query = query.eq("setup_id", options.setupId);
    }

    if (options?.bikeId) {
      query = query.eq("bike_id", options.bikeId);
    }

    const { data, error, count } = await query
      .order("activity_date", { ascending: false })
      .range(
        options?.offset || 0,
        (options?.offset || 0) + (options?.limit || 20) - 1
      );

    if (error) throw error;

    return { rides: data || [], total: count || 0 };
  }

  /**
   * Link a Strava ride to a suspension setup
   */
  async linkRideToSetup(rideId: string, setupId: string, bikeId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("strava_rides")
      .update({ setup_id: setupId, bike_id: bikeId })
      .eq("id", rideId);

    if (error) throw error;

    console.log(`[v0] Linked ride ${rideId} to setup ${setupId}`);
  }

  /**
   * Unlink a Strava ride from a setup
   */
  async unlinkRideFromSetup(rideId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("strava_rides")
      .update({ setup_id: null, bike_id: null })
      .eq("id", rideId);

    if (error) throw error;

    console.log(`[v0] Unlinked ride ${rideId}`);
  }

  /**
   * Check if user has Strava account connected
   */
  async isConnected(userId: string): Promise<boolean> {
    try {
      await stravaService.getTokens(userId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Disconnect Strava account and clear cached rides
   */
  async disconnectAccount(userId: string) {
    const supabase = await createClient();

    // Delete all cached rides for this user
    await supabase.from("strava_rides").delete().eq("user_id", userId);

    // Delete tokens
    await stravaService.disconnectAccount(userId);

    console.log(`[v0] Disconnected Strava account for user ${userId}`);
  }
}

export const stravaRideService = new StravaRideService();
