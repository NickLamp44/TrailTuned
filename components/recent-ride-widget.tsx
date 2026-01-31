"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Clock,
  Mountain,
  ExternalLink,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface RecentRideWidgetProps {
  userId: string;
}

export function RecentRideWidget({ userId }: RecentRideWidgetProps) {
  const [ride, setRide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestRide();
  }, []);

  const fetchLatestRide = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strava/latest-ride`);

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        setError(
          "Strava not connected. Visit Settings to connect your Strava account."
        );
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setRide(null);
        } else {
          throw new Error(data.error || "Failed to fetch ride");
        }
      } else {
        setRide(data.ride);
      }
    } catch (err) {
      console.error("[v0] Error fetching latest ride:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch latest ride"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Latest Ride
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Latest Ride
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!ride) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Latest Ride
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No rides synced yet. Connect your Strava account to see your latest
            rides.
          </p>
          <Link href="/dashboard/rides">
            <Button variant="outline" size="sm">
              View All Rides
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{ride.activity_name}</CardTitle>
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
        <div className="grid gap-3 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="font-semibold">{ride.distance_km.toFixed(1)} km</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Elevation</p>
              <p className="font-semibold">
                {Math.round(ride.elevation_gain_m)} m
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Setup</p>
              {ride.suspension_setups?.setup_name ? (
                <Badge variant="outline" className="text-xs">
                  {ride.suspension_setups.setup_name}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Not linked
                </Badge>
              )}
            </div>
          </div>

          {ride.bikes && (
            <div className="p-2 bg-muted rounded text-sm">
              <div className="flex items-center gap-2">
                <Mountain className="h-4 w-4" />
                <span>
                  {ride.bikes.year} {ride.bikes.brand} {ride.bikes.model}
                </span>
              </div>
            </div>
          )}
        </div>

        <Link href="/dashboard/rides" className="w-full">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            View All Rides
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
