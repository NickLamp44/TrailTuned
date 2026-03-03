import { Button } from "@/components/ui/button";
import { Mountain, Settings, Save, ClipboardList } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center">
            <div className="flex flex-1 items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <Mountain className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                <span className="text-xl font-bold">Trail Tuned</span>
              </Link>
            </div>

            <div className="hidden md:flex flex-1 justify-center" />

            <div className="flex flex-1 justify-end gap-3">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40 flex flex-col items-center gap-20">
          <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
            <div className="rounded-full bg-primary/10 p-6 ring-2 ring-primary/20">
              <Mountain className="h-16 w-16 text-primary" />
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight text-balance">
              Track Your Mountain Bike Suspension Settings
            </h1>

            <p className="text-xl text-muted-foreground text-balance max-w-2xl leading-relaxed">
              Never forget that perfect setup again. Track fork and shock
              settings for all your bikes in one place with detailed notes and
              history.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 ">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-primary hover:bg-primary/90"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8  bg-transparent"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid w-full max-w-6xl gap-6 md:grid-cols-3">
            <Feature
              icon={<ClipboardList className="h-6 w-6 text-primary" />}
              title="Track Multiple Bikes"
              description="Manage setups for your DH, enduro, and XC bikes all in one place."
            />
            <Feature
              icon={<Settings className="h-6 w-6 text-secondary" />}
              title="Detailed Settings"
              description="Track compression, rebound, pressure, volume spacers, and custom adjustments."
            />
            <Feature
              icon={<Save className="h-6 w-6 text-primary" />}
              title="Save & Compare"
              description="Name your setups, add notes, and keep a history of what works best."
            />
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/50 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Mountain className="h-4 w-4 text-primary" />
            Trail Tuned Development — Track Your Suspension Settings
          </p>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg">
      <div className="w-fit rounded-lg bg-primary/10 p-3">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
