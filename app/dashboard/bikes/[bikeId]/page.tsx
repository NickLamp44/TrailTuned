import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard-shell";
import { BikeDetails } from "@/components/bike-details";
import { SetupsList } from "@/components/setups-list";

export default async function BikePage({
  params,
}: {
  params: Promise<{ bikeId: string }>;
}) {
  const { bikeId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch bike details
  const { data: bike } = await supabase
    .from("bikes")
    .select("*")
    .eq("id", bikeId)
    .eq("user_id", data.user.id)
    .single();

  if (!bike) {
    redirect("/dashboard");
  }

  // Fetch suspension setups for this bike
  const { data: setups } = await supabase
    .from("suspension_setups")
    .select("*")
    .eq("bike_id", bikeId)
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell user={data.user}>
      <div className="space-y-6">
        <BikeDetails bike={bike} />
        <SetupsList
          bikeId={bikeId}
          setups={setups || []}
          currentBikeActiveSetupId={bike.active_setup_id}
        />
      </div>
    </DashboardShell>
  );
}
