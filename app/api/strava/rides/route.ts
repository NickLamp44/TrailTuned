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

    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Sync latest rides from Strava first
    try {
      await stravaRideService.syncUserRides(user.id);
    } catch (error) {
      console.error("Error syncing Strava rides:", error);
      // Continue anyway, they may have cached rides
    }

    const { rides, total } = await stravaRideService.getUserRides(user.id, {
      limit,
      offset,
    });

    return NextResponse.json({ rides, total });
  } catch (error) {
    console.error("Error fetching rides:", error);
    return NextResponse.json(
      { error: "Failed to fetch rides" },
      { status: 500 }
    );
  }
}
