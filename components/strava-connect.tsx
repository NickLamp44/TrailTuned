"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface StravaConnectProps {
  userId: string;
}

export function StravaConnect({ userId }: StravaConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`/api/strava/check-connection`);
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      console.error("Error checking Strava connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = `/api/auth/strava`;
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const response = await fetch(`/api/strava/disconnect`, {
        method: "POST",
      });

      if (response.ok) {
        setIsConnected(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error disconnecting Strava:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Strava Integration
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Strava Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isConnected ? (
            <>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  Your Strava account is connected
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your rides will automatically sync and you can link them to
                  suspension setups
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="w-full bg-transparent"
              >
                {isDisconnecting ? "Disconnecting..." : "Disconnect Strava"}
              </Button>
            </>
          ) : (
            <>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Connect your Strava account to sync your rides and track which
                  suspension setups you used on each ride
                </p>
              </div>
              <Button
                onClick={handleConnect}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Activity className="h-4 w-4 mr-2" />
                Connect with Strava
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
