import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard-shell";
import { RideHistory } from "@/components/ride-history";
import { StravaConnect } from "@/components/strava-connect";

export default async function RidesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell user={data.user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Strava Rides</h1>
          <p className="text-muted-foreground">
            Track all your mountain bike rides
          </p>
        </div>

        <RideHistory />
        <StravaConnect userId={data.user.id} />
      </div>
    </DashboardShell>
  );
}
