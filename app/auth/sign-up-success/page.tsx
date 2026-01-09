import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Trail Tuned</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>Confirm your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent you a confirmation email. Please check your inbox and click the link to verify your
                account before logging in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
