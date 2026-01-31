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

    await stravaRideService.disconnectAccount(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Strava:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Strava account" },
      { status: 500 }
    );
  }
}
