"use client";

import type React from "react";

import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Mountain, LogOut, BikeIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DashboardShellProps {
  children: React.ReactNode;
  user: User;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Mountain className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-bold text-xl">Trail Tuned</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard/bikes">
              <Button variant="ghost" size="sm" className="gap-2">
                <BikeIcon className="h-4 w-4" />
                My Bikes
              </Button>
            </Link>
            <Link href="/dashboard/rides">
              <Button variant="ghost" size="sm" className="gap-2">
                <Mountain className="h-4 w-4" />
                Rides
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
            <div className="hidden sm:block text-sm text-muted-foreground px-3 py-1 rounded-md bg-muted/50">
              {user.email}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-7xl py-8 px-4 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
