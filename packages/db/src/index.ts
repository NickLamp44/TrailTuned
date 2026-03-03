export * from "./client"
export { createClient as createServerClient } from "./server"
export type { Database } from "./database.types"

// Typed client type — use this as the parameter type in all service files
// so TypeScript knows about all table shapes.
import type { SupabaseClient as SupabaseClientBase } from "@supabase/supabase-js"
import type { Database } from "./database.types"
export type SupabaseClient = SupabaseClientBase<Database>
