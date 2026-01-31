import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stravaRideService } from "@/lib/strava/ride-service";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Just fetch the cached ride, don't sync on every request to avoid rate limits
    const ride = await stravaRideService.getLatestRide(user.id);

    if (!ride) {
      return NextResponse.json({ error: "No rides found" }, { status: 404 });
    }

    console.log("Latest ride:", {
      id: ride.id,
      name: ride.activity_name,
      hasPolyline: !!ride.polyline,
    });

    return NextResponse.json({ ride });
  } catch (error) {
    console.error("Error fetching latest ride:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch latest ride";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
