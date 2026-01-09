import { Button } from "@/components/ui/button"
import { Mountain, Settings, Save, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Mountain className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-bold text-xl">Trail Tuned</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-8 py-24 md:py-32 lg:py-40">
          <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
            <div className="rounded-full bg-primary/10 p-6 ring-2 ring-primary/20">
              <Mountain className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-balance leading-tight">
              Track Your Mountain Bike Suspension Settings
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl leading-relaxed">
              Never forget that perfect setup again. Track fork and shock settings for all your bikes in one place with
              detailed notes and history.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-20 max-w-6xl w-full">
            <div className="flex flex-col items-start gap-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="rounded-lg bg-primary/10 p-3">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Track Multiple Bikes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Manage setups for your DH, enduro, and XC bikes all in one place. Keep everything organized.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="rounded-lg bg-secondary/10 p-3">
                <Settings className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Detailed Settings</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track HSC, LSC, HSR, LSR, air pressure, volume spacers, spring rates, and any custom adjustments.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="rounded-lg bg-primary/10 p-3">
                <Save className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Save & Compare</h3>
              <p className="text-muted-foreground leading-relaxed">
                Name your setups, add detailed notes, and keep a history of what works best for different conditions.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/50 py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Mountain className="h-4 w-4 text-primary" />
            Trail Tuned - Track Your Suspension Settings
          </p>
        </div>
      </footer>
    </div>
  )
}
