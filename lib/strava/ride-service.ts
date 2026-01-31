import { createClient } from "@/lib/supabase/server";
import { stravaService } from "./service";

export class StravaRideService {
  
  async syncUserRides(userId: string) {
    try {
      const accessToken = await stravaService.getValidAccessToken(userId);
      const activities = await stravaService.getActivities(accessToken, {
        per_page: 50,
      });

      const supabase = await createClient();

      const mtbActivities = activities.filter((activity) =>
        ["Ride", "MountainBikeRide"].includes(activity.type)
      );

      
      for (let i = 0; i < mtbActivities.length; i++) {
        const activity = mtbActivities[i];
        try {
          
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 150));
          }

          
          const fullActivity = await stravaService.getActivity(
            accessToken,
            activity.id
          );

          console.log(
            `Syncing activity ${
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

          
          if (
            errorMsg.includes("Too Many Requests") ||
            errorMsg.includes("429")
          ) {
            console.log("Strava rate limit reached, stopping sync");
            break;
          }

          console.error(
            `Error fetching details for activity ${activity.id}:`,
            activityError
          );
        }
      }

      console.log(
        `Synced ${mtbActivities.length} rides for user ${userId}`
      );
      return mtbActivities.length;
    } catch (error) {
      console.error("Error syncing Strava rides:", error);
      throw error;
    }
  }

 
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


  async linkRideToSetup(rideId: string, setupId: string, bikeId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("strava_rides")
      .update({ setup_id: setupId, bike_id: bikeId })
      .eq("id", rideId);

    if (error) throw error;

    console.log(`Linked ride ${rideId} to setup ${setupId}`);
  }

  
  async unlinkRideFromSetup(rideId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("strava_rides")
      .update({ setup_id: null, bike_id: null })
      .eq("id", rideId);

    if (error) throw error;

    console.log(`Unlinked ride ${rideId}`);
  }

 
  async isConnected(userId: string): Promise<boolean> {
    try {
      await stravaService.getTokens(userId);
      return true;
    } catch {
      return false;
    }
  }

  async disconnectAccount(userId: string) {
    const supabase = await createClient();

    await supabase.from("strava_rides").delete().eq("user_id", userId);

    await stravaService.disconnectAccount(userId);

    console.log(`Disconnected Strava account for user ${userId}`);
  }
}

export const stravaRideService = new StravaRideService();
