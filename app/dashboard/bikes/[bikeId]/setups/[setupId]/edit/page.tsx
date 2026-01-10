import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard-shell"
import { SetupForm } from "@/components/setup-form"

export default async function EditSetupPage({
  params,
}: {
  params: Promise<{ bikeId: string; setupId: string }>
}) {
  const { bikeId, setupId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Verify bike belongs to user
  const { data: bike } = await supabase.from("bikes").select("*").eq("id", bikeId).eq("user_id", data.user.id).single()

  if (!bike) {
    redirect("/dashboard")
  }

  // Fetch the setup to edit
  const { data: setup } = await supabase
    .from("suspension_setups")
    .select("*")
    .eq("id", setupId)
    .eq("user_id", data.user.id)
    .single()

  if (!setup) {
    redirect(`/dashboard/bikes/${bikeId}`)
  }

  // Convert setup data to string format for form
  const initialData = {
    setup_name: setup.setup_name,
    fork_brand: setup.fork_brand || "",
    fork_model: setup.fork_model || "",
    fork_hsc: setup.fork_hsc?.toString() || "",
    fork_lsc: setup.fork_lsc?.toString() || "",
    fork_hsr: setup.fork_hsr?.toString() || "",
    fork_lsr: setup.fork_lsr?.toString() || "",
    fork_air_pressure: setup.fork_air_pressure?.toString() || "",
    fork_volume_spacers: setup.fork_volume_spacers?.toString() || "",
    fork_spring_rate: setup.fork_spring_rate?.toString() || "",
    fork_notes: setup.fork_notes || "",
    shock_brand: setup.shock_brand || "",
    shock_model: setup.shock_model || "",
    shock_hsc: setup.shock_hsc?.toString() || "",
    shock_lsc: setup.shock_lsc?.toString() || "",
    shock_hsr: setup.shock_hsr?.toString() || "",
    shock_lsr: setup.shock_lsr?.toString() || "",
    shock_air_pressure: setup.shock_air_pressure?.toString() || "",
    shock_volume_spacers: setup.shock_volume_spacers?.toString() || "",
    shock_spring_rate: setup.shock_spring_rate?.toString() || "",
    shock_notes: setup.shock_notes || "",
    notes: setup.notes || "",
  }

  return (
    <DashboardShell user={data.user}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Suspension Setup</h2>
          <p className="text-muted-foreground">
            Update fork and shock settings for {bike.brand} {bike.model}
          </p>
        </div>
        <SetupForm bikeId={bikeId} userId={data.user.id} setupId={setupId} initialData={initialData} />
      </div>
    </DashboardShell>
  )
}
