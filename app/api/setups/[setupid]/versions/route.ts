import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  segmentData: { params: Promise<{ setupid: string }> }
) {
  try {
    const { setupid } = await segmentData.params;
    console.log(" Versions API hit for setupId:", setupid);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("Versions API - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(" Versions API - querying for user:", user.id);

    const { data: versions, error: versionsError } = await supabase
      .from("setup_versions")
      .select("*")
      .eq("setup_id", setupid)
      .eq("user_id", user.id)
      .order("version_number", { ascending: false });

    if (versionsError) {
      console.error("Versions query error:", versionsError);
      if (versionsError.code === "42P01") {
        return NextResponse.json({ versions: [] });
      }
      return NextResponse.json(
        { error: versionsError.message },
        { status: 500 }
      );
    }

    console.log(" Versions found:", versions?.length || 0);
    return NextResponse.json({ versions: versions || [] });
  } catch (error) {
    console.error(" Error fetching setup versions:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch versions",
      },
      { status: 500 }
    );
  }
}
