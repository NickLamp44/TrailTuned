"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddSetupFormProps {
  bikeId: string;
  userId: string;
}

export function AddSetupForm({ bikeId, userId }: AddSetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    setup_name: "",
    // Fork
    fork_brand: "",
    fork_model: "",
    fork_hsc: "",
    fork_lsc: "",
    fork_hsr: "",
    fork_lsr: "",
    fork_air_pressure: "",
    fork_volume_spacers: "",
    fork_spring_rate: "",
    fork_notes: "",
    // Shock
    shock_brand: "",
    shock_model: "",
    shock_hsc: "",
    shock_lsc: "",
    shock_hsr: "",
    shock_lsr: "",
    shock_air_pressure: "",
    shock_volume_spacers: "",
    shock_spring_rate: "",
    shock_notes: "",
    // General
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.from("suspension_setups").insert({
        bike_id: bikeId,
        user_id: userId,
        setup_name: formData.setup_name,
        // Fork
        fork_brand: formData.fork_brand || null,
        fork_model: formData.fork_model || null,
        fork_hsc: formData.fork_hsc ? Number.parseInt(formData.fork_hsc) : null,
        fork_lsc: formData.fork_lsc ? Number.parseInt(formData.fork_lsc) : null,
        fork_hsr: formData.fork_hsr ? Number.parseInt(formData.fork_hsr) : null,
        fork_lsr: formData.fork_lsr ? Number.parseInt(formData.fork_lsr) : null,
        fork_air_pressure: formData.fork_air_pressure
          ? Number.parseFloat(formData.fork_air_pressure)
          : null,
        fork_volume_spacers: formData.fork_volume_spacers
          ? Number.parseInt(formData.fork_volume_spacers)
          : null,
        fork_spring_rate: formData.fork_spring_rate
          ? Number.parseFloat(formData.fork_spring_rate)
          : null,
        fork_notes: formData.fork_notes || null,
        // Shock
        shock_brand: formData.shock_brand || null,
        shock_model: formData.shock_model || null,
        shock_hsc: formData.shock_hsc
          ? Number.parseInt(formData.shock_hsc)
          : null,
        shock_lsc: formData.shock_lsc
          ? Number.parseInt(formData.shock_lsc)
          : null,
        shock_hsr: formData.shock_hsr
          ? Number.parseInt(formData.shock_hsr)
          : null,
        shock_lsr: formData.shock_lsr
          ? Number.parseInt(formData.shock_lsr)
          : null,
        shock_air_pressure: formData.shock_air_pressure
          ? Number.parseFloat(formData.shock_air_pressure)
          : null,
        shock_volume_spacers: formData.shock_volume_spacers
          ? Number.parseInt(formData.shock_volume_spacers)
          : null,
        shock_spring_rate: formData.shock_spring_rate
          ? Number.parseFloat(formData.shock_spring_rate)
          : null,
        shock_notes: formData.shock_notes || null,
        // General
        notes: formData.notes || null,
      });

      if (error) throw error;

      router.push(`/dashboard/bikes/${bikeId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Setup Name</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="setup_name">Name</Label>
            <Input
              id="setup_name"
              placeholder="e.g., Park Setup, XC Race, All Mountain"
              required
              value={formData.setup_name}
              onChange={(e) =>
                setFormData({ ...formData, setup_name: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fork" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fork">Fork</TabsTrigger>
          <TabsTrigger value="shock">Shock</TabsTrigger>
        </TabsList>

        <TabsContent value="fork" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fork Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fork_brand">Brand</Label>
                  <Input
                    id="fork_brand"
                    placeholder="e.g., RockShox, Fox, Ohlins"
                    value={formData.fork_brand}
                    onChange={(e) =>
                      setFormData({ ...formData, fork_brand: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fork_model">Model</Label>
                  <Input
                    id="fork_model"
                    placeholder="e.g., Lyrik, 38, RXF38"
                    value={formData.fork_model}
                    onChange={(e) =>
                      setFormData({ ...formData, fork_model: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="fork_hsc">HSC (clicks)</Label>
                  <Input
                    id="fork_hsc"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.fork_hsc}
                    onChange={(e) =>
                      setFormData({ ...formData, fork_hsc: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fork_lsc">LSC (clicks)</Label>
                  <Input
                    id="fork_lsc"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.fork_lsc}
                    onChange={(e) =>
                      setFormData({ ...formData, fork_lsc: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fork_hsr">HSR (clicks)</Label>
                  <Input
                    id="fork_hsr"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.fork_hsr}
                    onChange={(e) =>
                      setFormData({ ...formData, fork_hsr: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fork_lsr">LSR (clicks)</Label>
                  <Input
                    id="fork_lsr"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.fork_lsr}
                    onChange={(e) =>
                      setFormData({ ...formData, fork_lsr: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="fork_air_pressure">Air Pressure (PSI)</Label>
                  <Input
                    id="fork_air_pressure"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="85"
                    value={formData.fork_air_pressure}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fork_air_pressure: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fork_volume_spacers">Volume Spacers</Label>
                  <Input
                    id="fork_volume_spacers"
                    type="number"
                    min="0"
                    placeholder="2"
                    value={formData.fork_volume_spacers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fork_volume_spacers: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fork_spring_rate">Spring Rate (lb/in)</Label>
                  <Input
                    id="fork_spring_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="5.5"
                    value={formData.fork_spring_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fork_spring_rate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fork_notes">Fork Notes</Label>
                <Textarea
                  id="fork_notes"
                  placeholder="Additional fork settings or observations..."
                  rows={3}
                  value={formData.fork_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, fork_notes: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shock Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shock_brand">Brand</Label>
                  <Input
                    id="shock_brand"
                    placeholder="e.g., RockShox, Fox, Ohlins"
                    value={formData.shock_brand}
                    onChange={(e) =>
                      setFormData({ ...formData, shock_brand: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shock_model">Model</Label>
                  <Input
                    id="shock_model"
                    placeholder="e.g., Super Deluxe, Float X, TTX"
                    value={formData.shock_model}
                    onChange={(e) =>
                      setFormData({ ...formData, shock_model: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="shock_hsc">HSC (clicks)</Label>
                  <Input
                    id="shock_hsc"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.shock_hsc}
                    onChange={(e) =>
                      setFormData({ ...formData, shock_hsc: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shock_lsc">LSC (clicks)</Label>
                  <Input
                    id="shock_lsc"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.shock_lsc}
                    onChange={(e) =>
                      setFormData({ ...formData, shock_lsc: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shock_hsr">HSR (clicks)</Label>
                  <Input
                    id="shock_hsr"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.shock_hsr}
                    onChange={(e) =>
                      setFormData({ ...formData, shock_hsr: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shock_lsr">LSR (clicks)</Label>
                  <Input
                    id="shock_lsr"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.shock_lsr}
                    onChange={(e) =>
                      setFormData({ ...formData, shock_lsr: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="shock_air_pressure">Air Pressure (PSI)</Label>
                  <Input
                    id="shock_air_pressure"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="200"
                    value={formData.shock_air_pressure}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shock_air_pressure: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shock_volume_spacers">Volume Spacers</Label>
                  <Input
                    id="shock_volume_spacers"
                    type="number"
                    min="0"
                    placeholder="1"
                    value={formData.shock_volume_spacers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shock_volume_spacers: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shock_spring_rate">Spring Rate (lb/in)</Label>
                  <Input
                    id="shock_spring_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="550"
                    value={formData.shock_spring_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shock_spring_rate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shock_notes">Shock Notes</Label>
                <Textarea
                  id="shock_notes"
                  placeholder="Additional shock settings or observations..."
                  rows={3}
                  value={formData.shock_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, shock_notes: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>General Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Setup Notes</Label>
            <Textarea
              id="notes"
              placeholder="Overall impressions, trail conditions, rider weight, etc..."
              rows={4}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Setup"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/dashboard/bikes/${bikeId}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
