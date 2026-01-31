import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sessionService } from "@/lib/strava/session-service";

export async function POST(request: NextRequest) {
  try {
    const { bikeId, setupId } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!bikeId || !setupId) {
      return NextResponse.json(
        { error: "bikeId and setupId are required" },
        { status: 400 }
      );
    }

    const session = await sessionService.activateSetup(
      user.id,
      bikeId,
      setupId
    );

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error activating session:", error);
    return NextResponse.json(
      { error: "Failed to activate session" },
      { status: 500 }
    );
  }
}
