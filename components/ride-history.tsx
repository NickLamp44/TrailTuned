"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Mountain,
  Clock,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ActivityMap } from "@/components/activity-map";

interface Ride {
  id: string;
  strava_activity_id: number;
  activity_name: string;
  activity_type: string;
  distance_km: number;
  elevation_gain_m: number;
  moving_time_seconds: number;
  activity_date: string;
  strava_url: string;
  polyline?: string;
  avg_speed?: number;
  max_speed?: number;
  bikes?: {
    brand: string;
    model: string;
    year: number;
  };
  suspension_setups?: {
    setup_name: string;
  };
}

export function RideHistory() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchRides();
  }, [page]);

  const fetchRides = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strava/rides?page=${page}&limit=20`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      if (page === 1) {
        setRides(data.rides);
      } else {
        setRides((prev) => [...prev, ...data.rides]);
      }

      setHasMore(data.total > rides.length + data.rides.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rides");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isLoading && page === 1) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-pulse">Loading rides...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (rides.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No rides synced yet
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Connect your Strava account and record some rides to see them here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold">Your Rides</h3>
        <p className="text-sm text-muted-foreground">
          {rides.length} ride{rides.length !== 1 ? "s" : ""} synced from Strava
        </p>
      </div>

      <div className="grid gap-4">
        {rides.map((ride) => (
          <Card key={ride.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {ride.activity_name}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(ride.activity_date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(ride.moving_time_seconds)}
                    </div>
                  </div>
                </div>
                <a
                  href={ride.strava_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </CardHeader>
            <CardContent>
              {ride.polyline && (
                <div className="mb-4">
                  <ActivityMap polyline={ride.polyline} height="h-48" />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="text-lg font-semibold">
                    {ride.distance_km.toFixed(1)} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Elevation Gain
                  </p>
                  <p className="text-lg font-semibold">
                    {Math.round(ride.elevation_gain_m)} m
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold capitalize">
                    {ride.activity_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Setup</p>
                  {ride.suspension_setups?.setup_name ? (
                    <Badge variant="outline">
                      {ride.suspension_setups.setup_name}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not linked</Badge>
                  )}
                </div>
              </div>

              {ride.bikes && (
                <div className="p-3 bg-muted rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <Mountain className="h-4 w-4" />
                    <span className="text-sm">
                      {ride.bikes.year} {ride.bikes.brand} {ride.bikes.model}
                    </span>
                  </div>
                </div>
              )}

              {!ride.suspension_setups?.setup_name && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary font-medium">
                    Link this ride to a setup to track performance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More Rides"}
          </Button>
        </div>
      )}
    </div>
  );
}
