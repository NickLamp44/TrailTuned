import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard-shell";
import { SetupVersionHistory } from "@/components/setup-version-history";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function SetupHistoryPage({
  params,
}: {
  params: Promise<{ bikeId: string; setupId: string }>;
}) {
  const { bikeId, setupId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Verify setup belongs to user
  const { data: setup, error: setupError } = await supabase
    .from("suspension_setups")
    .select("*")
    .eq("id", setupId)
    .eq("user_id", data.user.id)
    .single();

  if (!setup || setupError) {
    redirect("/dashboard");
  }

  // Fetch setup versions
  const { data: versions } = await supabase
    .from("setup_versions")
    .select("*")
    .eq("setup_id", setupId)
    .eq("user_id", data.user.id)
    .order("version_number", { ascending: false });

  return (
    <DashboardShell user={data.user}>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <Link href={`/dashboard/bikes/${bikeId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bike
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            Setup Version History
          </h2>
          <p className="text-muted-foreground">
            {setup.setup_name} - All changes and versions tracked over time
          </p>
        </div>
        <SetupVersionHistory setupId={setupId} setupName={setup.setup_name} />
      </div>
    </DashboardShell>
  );
}
