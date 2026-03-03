// Re-export everything so consumers can import from "@trailtuned/db"
export * from "./client"

// Named re-export for environments that need the raw supabase-js client
export { createClient as createSupabaseClient } from "@supabase/supabase-js"
