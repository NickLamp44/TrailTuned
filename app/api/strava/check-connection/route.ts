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
      return NextResponse.json({ connected: false });
    }

    const isConnected = await stravaRideService.isConnected(user.id);

    return NextResponse.json({ connected: isConnected });
  } catch (error) {
    console.error("Error checking Strava connection:", error);
    return NextResponse.json({ connected: false });
  }
}
