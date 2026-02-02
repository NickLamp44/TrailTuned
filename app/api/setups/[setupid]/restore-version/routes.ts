import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { setupVersionService } from "@/lib/setup-version-service";

export async function POST(
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

    const { versionId } = await request.json();

    if (!versionId) {
      return NextResponse.json(
        { error: "versionId is required" },
        { status: 400 }
      );
    }

    const restoredVersion = await setupVersionService.restoreVersion(
      params.setupId,
      user.id,
      versionId
    );

    return NextResponse.json({ version: restoredVersion });
  } catch (error) {
    console.error("[v0] Error restoring setup version:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to restore version",
      },
      { status: 500 }
    );
  }
}
