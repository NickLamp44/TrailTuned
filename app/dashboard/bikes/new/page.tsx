import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard-shell"
import { AddBikeForm } from "@/components/add-bike-form"

export default async function AddBikePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <DashboardShell user={data.user}>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Bike</h2>
          <p className="text-muted-foreground">Enter your bike details to start tracking setups</p>
        </div>
        <AddBikeForm userId={data.user.id} />
      </div>
    </DashboardShell>
  )
}
