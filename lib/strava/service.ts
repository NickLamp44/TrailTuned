import { createClient } from "@/lib/supabase/server";

interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
    profile_medium: string;
    profile: string;
  };
}

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  elevation_gain: number;
  moving_time: number;
  start_date: string;
  resource_state: number;
  average_speed?: number;
  max_speed?: number;
  map?: {
    summary_polyline?: string;
  };
}

export class StravaService {
  private clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  private clientSecret = process.env.STRAVA_CLIENT_SECRET;
  private redirectUrl = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URL;
  private apiUrl =
    process.env.NEXT_PUBLIC_STRAVA_API_URL || "https://www.strava.com/api/v3";

  /**
   * Generate Strava OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId || "",
      redirect_uri: this.redirectUrl || "",
      response_type: "code",
      scope: "read,activity:read_all",
      state: state,
    });

    return `https://www.strava.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
    const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to exchange code for token: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   */
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
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get athlete's activities with optional filters
   */
  async getActivities(
    accessToken: string,
    options?: {
      before?: number;
      after?: number;
      page?: number;
      per_page?: number;
    }
  ): Promise<StravaActivity[]> {
    const params = new URLSearchParams({
      page: options?.page?.toString() || "1",
      per_page: options?.per_page?.toString() || "30",
    });

    if (options?.before) params.append("before", options.before.toString());
    if (options?.after) params.append("after", options.after.toString());

    const response = await fetch(
      `${this.apiUrl}/athlete/activities?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get activities: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a specific activity
   */
  async getActivity(accessToken: string, activityId: number): Promise<any> {
    const response = await fetch(`${this.apiUrl}/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get activity: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Save Strava tokens to database
   */
  async saveTokens(userId: string, tokenData: StravaTokenResponse) {
    const supabase = await createClient();

    const { error } = await supabase.from("strava_tokens").upsert({
      user_id: userId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
      athlete_id: tokenData.athlete.id,
    });

    if (error) throw error;
  }

  /**
   * Get Strava tokens from database
   */
  async getTokens(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("strava_tokens")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get valid access token, refreshing if needed
   */
  async getValidAccessToken(userId: string): Promise<string> {
    const tokens = await this.getTokens(userId);

    const expiresAt = new Date(tokens.token_expires_at).getTime();
    const now = Date.now();

    // If token expires in less than 5 minutes, refresh it
    if (expiresAt - now < 5 * 60 * 1000) {
      console.log("[Token expiring soon, refreshing...");
      const newTokenData = await this.refreshAccessToken(tokens.refresh_token);
      await this.saveTokens(userId, newTokenData);
      return newTokenData.access_token;
    }

    return tokens.access_token;
  }

  /**
   * Disconnect Strava account (delete tokens)
   */
  async disconnectAccount(userId: string) {
    const supabase = await createClient();

    const { error } = await supabase
      .from("strava_tokens")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  }
}

export const stravaService = new StravaService();
