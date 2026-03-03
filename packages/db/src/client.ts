/**
 * Browser / React Native client
 * Used by: apps/web (client components), apps/native
 *
 * For apps/web server components and API routes, use the server client
 * from @trailtuned/db/server instead.
 */
import { createClient as createSupabaseBrowserClient } from "@supabase/supabase-js"

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (web) " +
      "or EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (native)."
    )
  }

  return createSupabaseBrowserClient(url, key)
}

// Convenience alias — matches the existing import pattern in the web app
export const createClient = createBrowserClient
