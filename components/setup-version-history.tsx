"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SetupVersion {
  id: string;
  setup_id: string;
  version_number: number;
  version_name?: string;
  notes?: string;
  is_manual_snapshot: boolean;
  created_at: string;
  fork_component_id?: string;
  fork_brand?: string;
  fork_model?: string;
  fork_hsc?: number;
  fork_lsc?: number;
  fork_hsr?: number;
  fork_lsr?: number;
  fork_compression?: number;
  fork_rebound?: number;
  fork_air_pressure?: number;
  fork_ramp_chamber_pressure?: number;
  fork_volume_spacers?: number;
  fork_spring_rate?: number;
  fork_notes?: string;
  shock_component_id?: string;
  shock_brand?: string;
  shock_model?: string;
  shock_hsc?: number;
  shock_lsc?: number;
  shock_hsr?: number;
  shock_lsr?: number;
  shock_compression?: number;
  shock_rebound?: number;
  shock_air_pressure?: number;
  shock_hbo?: number;
  shock_volume_spacers?: number;
  shock_spring_rate?: number;
  shock_notes?: string;
}

interface SetupVersionHistoryProps {
  setupId: string;
  setupName: string;
}

export function SetupVersionHistory({
  setupId,
  setupName,
}: SetupVersionHistoryProps) {
  const [versions, setVersions] = useState<SetupVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVersions();
  }, [setupId]);

  const fetchVersions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/setups/${setupId}/versions`);
      if (!response.ok) throw new Error("Failed to fetch versions");
      const data = await response.json();
      setVersions(data.versions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch versions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      const response = await fetch(`/api/setups/${setupId}/restore-version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });

      if (!response.ok) throw new Error("Failed to restore version");

      // Refresh versions
      await fetchVersions();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to restore version");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse">Loading version history...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (versions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No version history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">Version History</h3>
        <p className="text-sm text-muted-foreground">{setupName}</p>
      </div>

      <div className="space-y-3">
        {versions.map((version, index) => (
          <Card
            key={version.id}
            className={`${index === 0 ? "border-primary/50 bg-primary/5" : ""}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">
                      Version {version.version_number}
                    </span>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                    {version.is_manual_snapshot && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Snapshot
                      </Badge>
                    )}
                  </div>

                  {version.version_name && (
                    <p className="text-sm font-medium mb-1">
                      {version.version_name}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    {formatDate(version.created_at)}
                  </div>

                  {version.notes && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {version.notes}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {version.fork_brand && (
                      <div className="space-y-1 p-2 bg-muted rounded">
                        <div className="font-medium">Fork</div>
                        <div className="text-muted-foreground">
                          {version.fork_brand} {version.fork_model}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {version.fork_hsc !== undefined &&
                            version.fork_hsc !== null && (
                              <div>
                                <span className="font-medium">HSC:</span>{" "}
                                {version.fork_hsc}
                              </div>
                            )}
                          {version.fork_lsc !== undefined &&
                            version.fork_lsc !== null && (
                              <div>
                                <span className="font-medium">LSC:</span>{" "}
                                {version.fork_lsc}
                              </div>
                            )}
                          {version.fork_hsr !== undefined &&
                            version.fork_hsr !== null && (
                              <div>
                                <span className="font-medium">HSR:</span>{" "}
                                {version.fork_hsr}
                              </div>
                            )}
                          {version.fork_lsr !== undefined &&
                            version.fork_lsr !== null && (
                              <div>
                                <span className="font-medium">LSR:</span>{" "}
                                {version.fork_lsr}
                              </div>
                            )}
                          {version.fork_compression !== undefined &&
                            version.fork_compression !== null && (
                              <div>
                                <span className="font-medium">Comp:</span>{" "}
                                {version.fork_compression}
                              </div>
                            )}
                          {version.fork_rebound !== undefined &&
                            version.fork_rebound !== null && (
                              <div>
                                <span className="font-medium">Reb:</span>{" "}
                                {version.fork_rebound}
                              </div>
                            )}
                          {version.fork_air_pressure !== undefined &&
                            version.fork_air_pressure !== null && (
                              <div>
                                <span className="font-medium">PSI:</span>{" "}
                                {version.fork_air_pressure}
                              </div>
                            )}
                          {version.fork_ramp_chamber_pressure !== undefined &&
                            version.fork_ramp_chamber_pressure !== null && (
                              <div>
                                <span className="font-medium">Ramp:</span>{" "}
                                {version.fork_ramp_chamber_pressure}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                    {version.shock_brand && (
                      <div className="space-y-1 p-2 bg-muted rounded">
                        <div className="font-medium">Shock</div>
                        <div className="text-muted-foreground">
                          {version.shock_brand} {version.shock_model}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {version.shock_hsc !== undefined &&
                            version.shock_hsc !== null && (
                              <div>
                                <span className="font-medium">HSC:</span>{" "}
                                {version.shock_hsc}
                              </div>
                            )}
                          {version.shock_lsc !== undefined &&
                            version.shock_lsc !== null && (
                              <div>
                                <span className="font-medium">LSC:</span>{" "}
                                {version.shock_lsc}
                              </div>
                            )}
                          {version.shock_hsr !== undefined &&
                            version.shock_hsr !== null && (
                              <div>
                                <span className="font-medium">HSR:</span>{" "}
                                {version.shock_hsr}
                              </div>
                            )}
                          {version.shock_lsr !== undefined &&
                            version.shock_lsr !== null && (
                              <div>
                                <span className="font-medium">LSR:</span>{" "}
                                {version.shock_lsr}
                              </div>
                            )}
                          {version.shock_compression !== undefined &&
                            version.shock_compression !== null && (
                              <div>
                                <span className="font-medium">Comp:</span>{" "}
                                {version.shock_compression}
                              </div>
                            )}
                          {version.shock_rebound !== undefined &&
                            version.shock_rebound !== null && (
                              <div>
                                <span className="font-medium">Reb:</span>{" "}
                                {version.shock_rebound}
                              </div>
                            )}
                          {version.shock_air_pressure !== undefined &&
                            version.shock_air_pressure !== null && (
                              <div>
                                <span className="font-medium">PSI:</span>{" "}
                                {version.shock_air_pressure}
                              </div>
                            )}
                          {version.shock_hbo !== undefined &&
                            version.shock_hbo !== null && (
                              <div>
                                <span className="font-medium">HBO:</span>{" "}
                                {version.shock_hbo}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {index !== 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreVersion(version.id)}
                    className="whitespace-nowrap"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
