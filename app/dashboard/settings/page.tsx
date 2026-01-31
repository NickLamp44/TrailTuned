import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard-shell";
import { StravaConnect } from "@/components/strava-connect";
import { ChangeEmailForm } from "@/components/change-email-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { DeleteAccountSection } from "@/components/delete-account-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell user={data.user}>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account and integrations
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ChangeEmailForm currentEmail={data.user.email || ""} />
          <ChangePasswordForm />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Strava Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <StravaConnect userId={data.user.id} />
          </CardContent>
        </Card>

        <DeleteAccountSection />
      </div>
    </DashboardShell>
  );
}
