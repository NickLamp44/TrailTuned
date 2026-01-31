import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sessionService } from "@/lib/strava/session-service";

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

    await sessionService.deactivateSession(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deactivating session:", error);
    return NextResponse.json(
      { error: "Failed to deactivate session" },
      { status: 500 }
    );
  }
}
