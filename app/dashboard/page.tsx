import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard-shell"
import { BikesList } from "@/components/bikes-list"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user's bikes
  const { data: bikes } = await supabase
    .from("bikes")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell user={data.user}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Bikes</h2>
          <p className="text-muted-foreground">Manage your bikes and suspension setups</p>
        </div>
        <BikesList bikes={bikes || []} />
      </div>
    </DashboardShell>
  )
}
