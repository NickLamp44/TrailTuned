import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stravaService } from "@/lib/strava/service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const scope = searchParams.get("scope");
    const error = searchParams.get("error");

    // Check for errors from Strava
    if (error) {
      console.error("Strava OAuth error:", error);
      return NextResponse.redirect(
        new URL(
          `/dashboard?strava_error=${encodeURIComponent(error)}`,
          request.url
        )
      );
    }

    if (!code) {
      console.error("No authorization code received from Strava");
      return NextResponse.redirect(
        new URL("/dashboard?strava_error=no_code", request.url)
      );
    }

    // Exchange code for access token
    const tokenData = await stravaService.exchangeCodeForToken(code);

    // Get current user
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Save tokens to database
    await stravaService.saveTokens(user.id, tokenData);

    console.log(
      "Strava account connected successfully for user:",
      user.id
    );

    return NextResponse.redirect(
      new URL("/dashboard?strava_connected=true", request.url)
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      new URL(
        `/dashboard?strava_error=${encodeURIComponent(errorMessage)}`,
        request.url
      )
    );
  }
}
