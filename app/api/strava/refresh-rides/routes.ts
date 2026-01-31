import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stravaRideService } from "@/lib/strava/ride-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sync rides - this will now fetch full activity details with polyline
    const syncedCount = await stravaRideService.syncUserRides(user.id);

    return NextResponse.json({
      success: true,
      message: `Refreshed ${syncedCount} rides`,
      count: syncedCount,
    });
  } catch (error) {
    console.error("[v0] Error refreshing rides:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to refresh rides";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
