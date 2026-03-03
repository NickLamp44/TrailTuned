import type { StravaTokenResponse, StravaActivity } from "@trailtuned/types"
import type { SupabaseClient } from "@trailtuned/db"

/**
 * StravaService — token exchange, refresh, and activity fetching.
 * Platform-agnostic: no Next.js or Expo imports.
 * The createClient factory is injected at call time to keep this
 * package free of framework-specific Supabase clients.
 */
export class StravaService {
  private clientId: string | undefined
  private clientSecret: string | undefined
  private redirectUrl: string | undefined
  private apiUrl: string

  constructor() {
    // Works with both NEXT_PUBLIC_ (web) and EXPO_PUBLIC_ (native) env var prefixes
    this.clientId =
      process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID ??
      process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID
    this.clientSecret = process.env.STRAVA_CLIENT_SECRET
    this.redirectUrl =
      process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URL ??
      process.env.EXPO_PUBLIC_STRAVA_REDIRECT_URL
    this.apiUrl =
      process.env.NEXT_PUBLIC_STRAVA_API_URL ??
      process.env.EXPO_PUBLIC_STRAVA_API_URL ??
      "https://www.strava.com/api/v3"
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId ?? "",
      redirect_uri: this.redirectUrl ?? "",
      response_type: "code",
      scope: "read,activity:read_all",
      state,
    })
    return `https://www.strava.com/oauth/authorize?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
    const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    })
    if (!response.ok) {
      throw new Error(`Failed to exchange code for token: ${response.statusText}`)
    }
    return response.json() as Promise<StravaTokenResponse>
  }

  async refreshAccessToken(refreshToken: string): Promise<StravaTokenResponse> {
    const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })
    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`)
    }
    return response.json() as Promise<StravaTokenResponse>
  }

  async getActivities(
    accessToken: string,
    options?: {
      before?: number
      after?: number
      page?: number
      per_page?: number
    }
  ): Promise<StravaActivity[]> {
    const params = new URLSearchParams({
      page: options?.page?.toString() ?? "1",
      per_page: options?.per_page?.toString() ?? "30",
    })
    if (options?.before) params.append("before", options.before.toString())
    if (options?.after) params.append("after", options.after.toString())

    const response = await fetch(
      `${this.apiUrl}/athlete/activities?${params.toString()}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!response.ok) {
      throw new Error(`Failed to get activities: ${response.statusText}`)
    }
    return response.json() as Promise<StravaActivity[]>
  }

  async getActivity(accessToken: string, activityId: number): Promise<StravaActivity & Record<string, unknown>> {
    const response = await fetch(`${this.apiUrl}/activities/${activityId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
      throw new Error(`Failed to get activity: ${response.statusText}`)
    }
    return response.json()
  }

  /**
   * Save Strava tokens to database.
   * Accepts a supabase client instance so this works with both
   * the server client (web API routes) and the browser client (native).
   */
  async saveTokens(
    supabase: SupabaseClient,
    userId: string,
    tokenData: StravaTokenResponse
  ) {
    const { error } = await supabase.from("strava_tokens").upsert({
      user_id: userId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
      athlete_id: tokenData.athlete.id,
    })
    if (error) throw error
  }

  async getTokens(
    supabase: SupabaseClient,
    userId: string
  ) {
    const { data, error } = await supabase
      .from("strava_tokens")
      .select("*")
      .eq("user_id", userId)
      .single()
    if (error) throw error
    return data
  }

  /**
   * Returns a valid access token, refreshing from Strava if it expires within 5 minutes.
   * Also updates last_synced_at timestamp used by the rate-limit guard.
   */
  async getValidAccessToken(
    supabase: SupabaseClient,
    userId: string
  ): Promise<string> {
    const tokens = await this.getTokens(supabase, userId)
    const expiresAt = new Date(tokens.token_expires_at).getTime()
    const now = Date.now()

    if (expiresAt - now < 5 * 60 * 1000) {
      const newTokenData = await this.refreshAccessToken(tokens.refresh_token)
      await this.saveTokens(supabase, userId, newTokenData)
      return newTokenData.access_token
    }

    return tokens.access_token
  }

  async disconnectAccount(
    supabase: SupabaseClient,
    userId: string
  ) {
    const { error } = await supabase
      .from("strava_tokens")
      .delete()
      .eq("user_id", userId)
    if (error) throw error
  }
}

export const stravaService = new StravaService()
