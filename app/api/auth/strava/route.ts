import { NextRequest, NextResponse } from "next/server";
import { stravaService } from "@/lib/strava/service";

export async function GET(request: NextRequest) {
  try {
    // Generate a random state token for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);

    // Get the Strava authorization URL
    const authUrl = stravaService.getAuthUrl(state);

    // Redirect to Strava
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error(" Error initiating Strava OAuth:", error);
    return NextResponse.json(
      { error: "Failed to initiate Strava OAuth" },
      { status: 500 }
    );
  }
}
