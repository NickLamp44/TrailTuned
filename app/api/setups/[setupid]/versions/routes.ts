import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { setupVersionService } from "@/lib/setup-version-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { setupId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const versions = await setupVersionService.getSetupVersions(
      params.setupId,
      user.id
    );

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("[v0] Error fetching setup versions:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch versions",
      },
      { status: 500 }
    );
  }
}
