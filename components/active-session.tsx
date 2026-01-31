"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActiveSessionProps {
  bikeId?: string;
  setupId?: string;
  setupName?: string;
  bikeName?: string;
  isActive?: boolean;
}

export function ActiveSession({
  bikeId,
  setupId,
  setupName,
  bikeName,
  isActive = false,
}: ActiveSessionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleActivate = async () => {
    if (!bikeId || !setupId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/strava/session/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bikeId, setupId }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error activating session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/strava/session/deactivate`, {
        method: "POST",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deactivating session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isActive) {
    return (
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-green-600">Active</Badge>
              Tracking Session
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-background rounded-lg border">
              <p className="text-sm font-medium">{setupName}</p>
              <p className="text-xs text-muted-foreground mt-1">{bikeName}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Any Strava rides recorded now will be linked to this setup
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDeactivate}
              disabled={isLoading}
              className="w-full bg-transparent"
            >
              <Square className="h-4 w-4 mr-2" />
              {isLoading ? "Stopping..." : "Stop Tracking"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!setupId || !bikeId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Start Tracking Rides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a bike and setup to start tracking. Any rides you record on
            Strava during this session will be automatically linked to this
            setup.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start Tracking Rides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{setupName}</p>
            <p className="text-xs text-muted-foreground mt-1">{bikeName}</p>
          </div>
          <Button
            onClick={handleActivate}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? "Starting..." : "Start Tracking"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
