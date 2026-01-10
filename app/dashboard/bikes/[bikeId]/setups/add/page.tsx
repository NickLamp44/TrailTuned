import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard-shell"
import { SetupForm } from "@/components/setup-form"

export default async function AddSetupPage({
  params,
}: {
  params: Promise<{ bikeId: string }>
}) {
  const { bikeId } = await params
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

  return (
    <DashboardShell user={data.user}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Suspension Setup</h2>
          <p className="text-muted-foreground">
            Track your fork and shock settings for {bike.brand} {bike.model}
          </p>
        </div>
        <SetupForm bikeId={bikeId} userId={data.user.id} />
      </div>
    </DashboardShell>
  )
}
