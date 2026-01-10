"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface SetupFormProps {
  bikeId: string;
  userId: string;
  setupId?: string;
  initialData?: SetupData;
}

interface SetupData {
  setup_name: string;
  fork_component_id: string | null;
  shock_component_id: string | null;
  fork_hsc: string;
  fork_lsc: string;
  fork_hsr: string;
  fork_lsr: string;
  fork_compression: string;
  fork_rebound: string;
  fork_air_pressure: string;
  fork_ramp_chamber_pressure: string; // Fixed to match database schema
  fork_volume_spacers: string;
  fork_spring_rate: string;
  fork_notes: string;
  shock_hsc: string;
  shock_lsc: string;
  shock_hsr: string;
  shock_lsr: string;
  shock_compression: string;
  shock_rebound: string;
  shock_air_pressure: string;
  shock_ramp_chamber_pressure: string; // Fixed to match database schema
  shock_volume_spacers: string;
  shock_spring_rate: string;
  shock_notes: string;
  notes: string;
}

interface SuspensionComponent {
  id: string;
  brand: string;
  model: string;
  year: number;
  component_type: string;
  damper_variant: string | null;
  damper_name: string | null;
  spring_type: string | null;
  available_adjustments: {
    hsc: boolean;
    lsc: boolean;
    hsr: boolean;
    lsr: boolean;
    compression: boolean;
    rebound: boolean;
    air_pressure: boolean;
    volume_spacers: boolean;
    spring_rate: boolean;
    has_ramp_chamber: boolean;
  };
}

const normalizeSetupData = (data: any): SetupData => {
  return {
    setup_name: data?.setup_name || "",
    fork_component_id: data?.fork_component_id || null,
    shock_component_id: data?.shock_component_id || null,
    fork_hsc: data?.fork_hsc?.toString() || "",
    fork_lsc: data?.fork_lsc?.toString() || "",
    fork_hsr: data?.fork_hsr?.toString() || "",
    fork_lsr: data?.fork_lsr?.toString() || "",
    fork_compression: data?.fork_compression?.toString() || "",
    fork_rebound: data?.fork_rebound?.toString() || "",
    fork_air_pressure: data?.fork_air_pressure?.toString() || "",
    fork_ramp_chamber_pressure:
      data?.fork_ramp_chamber_pressure?.toString() || "",
    fork_volume_spacers: data?.fork_volume_spacers?.toString() || "",
    fork_spring_rate: data?.fork_spring_rate?.toString() || "",
    fork_notes: data?.fork_notes || "",
    shock_hsc: data?.shock_hsc?.toString() || "",
    shock_lsc: data?.shock_lsc?.toString() || "",
    shock_hsr: data?.shock_hsr?.toString() || "",
    shock_lsr: data?.shock_lsr?.toString() || "",
    shock_compression: data?.shock_compression?.toString() || "",
    shock_rebound: data?.shock_rebound?.toString() || "",
    shock_air_pressure: data?.shock_air_pressure?.toString() || "",
    shock_ramp_chamber_pressure:
      data?.shock_ramp_chamber_pressure?.toString() || "",
    shock_volume_spacers: data?.shock_volume_spacers?.toString() || "",
    shock_spring_rate: data?.shock_spring_rate?.toString() || "",
    shock_notes: data?.shock_notes || "",
    notes: data?.notes || "",
  };
};

export function SetupForm({
  bikeId,
  userId,
  setupId,
  initialData,
}: SetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!setupId;

  const [forkExpanded, setForkExpanded] = useState(false);
  const [shockExpanded, setShockExpanded] = useState(false);

  const [allComponents, setAllComponents] = useState<SuspensionComponent[]>([]);
  const [forkBrands, setForkBrands] = useState<string[]>([]);
  const [shockBrands, setShockBrands] = useState<string[]>([]);

  const [selectedForkBrand, setSelectedForkBrand] = useState<string>("");
  const [selectedForkYear, setSelectedForkYear] = useState<string>("");
  const [selectedForkModel, setSelectedForkModel] = useState<string>("");

  const [selectedShockBrand, setSelectedShockBrand] = useState<string>("");
  const [selectedShockYear, setSelectedShockYear] = useState<string>("");
  const [selectedShockModel, setSelectedShockModel] = useState<string>("");

  const [forkYears, setForkYears] = useState<number[]>([]);
  const [forkModels, setForkModels] = useState<string[]>([]);

  const [shockYears, setShockYears] = useState<number[]>([]);
  const [shockModels, setShockModels] = useState<string[]>([]);

  const [selectedFork, setSelectedFork] = useState<SuspensionComponent | null>(
    null
  );
  const [selectedShock, setSelectedShock] =
    useState<SuspensionComponent | null>(null);

  const [formData, setFormData] = useState<SetupData>(
    initialData ? normalizeSetupData(initialData) : normalizeSetupData({})
  );

  useEffect(() => {
    const loadComponents = async () => {
      const supabase = createClient();

      const { data: components } = await supabase
        .from("suspension_components")
        .select("*")
        .order("brand", { ascending: true })
        .order("year", { ascending: false })
        .order("model", { ascending: true });

      if (components) {
        setAllComponents(components);

        // Extract unique brands
        const forks = components.filter((c) => c.component_type === "fork");
        const shocks = components.filter((c) => c.component_type === "shock");

        const uniqueForkBrands = [...new Set(forks.map((f) => f.brand))];
        const uniqueShockBrands = [...new Set(shocks.map((s) => s.brand))];

        setForkBrands(uniqueForkBrands);
        setShockBrands(uniqueShockBrands);

        if (initialData?.fork_component_id && components) {
          const fork = components.find(
            (f) => f.id === initialData.fork_component_id
          );
          if (fork) {
            setForkExpanded(true);
            setSelectedFork(fork);
            setSelectedForkBrand(fork.brand);
            setSelectedForkYear(fork.year.toString());
            setSelectedForkModel(fork.model);
          }
        }
        if (initialData?.shock_component_id && components) {
          const shock = components.find(
            (s) => s.id === initialData.shock_component_id
          );
          if (shock) {
            setShockExpanded(true);
            setSelectedShock(shock);
            setSelectedShockBrand(shock.brand);
            setSelectedShockYear(shock.year.toString());
            setSelectedShockModel(shock.model);
          }
        }
      }
    };

    loadComponents();
  }, [initialData]);

  useEffect(() => {
    if (!selectedForkBrand) {
      setForkYears([]);
      setSelectedForkYear("");
      return;
    }

    const filteredComponents = allComponents.filter(
      (c) => c.component_type === "fork" && c.brand === selectedForkBrand
    );
    const uniqueYears = [
      ...new Set(filteredComponents.map((c) => c.year)),
    ].sort((a, b) => b - a);
    setForkYears(uniqueYears);
  }, [selectedForkBrand, allComponents]);

  useEffect(() => {
    if (!selectedForkBrand || !selectedForkYear) {
      setForkModels([]);
      setSelectedForkModel("");
      return;
    }

    const filteredComponents = allComponents.filter(
      (c) =>
        c.component_type === "fork" &&
        c.brand === selectedForkBrand &&
        c.year === Number.parseInt(selectedForkYear)
    );
    const uniqueModels = [...new Set(filteredComponents.map((c) => c.model))];
    setForkModels(uniqueModels);
  }, [selectedForkBrand, selectedForkYear, allComponents]);

  useEffect(() => {
    if (!selectedForkBrand || !selectedForkYear || !selectedForkModel) {
      setSelectedFork(null);
      setFormData((prev) => ({ ...prev, fork_component_id: null }));
      return;
    }

    // Find first matching component for the selected brand, year, and model
    const component = allComponents.find(
      (c) =>
        c.component_type === "fork" &&
        c.brand === selectedForkBrand &&
        c.year === Number.parseInt(selectedForkYear) &&
        c.model === selectedForkModel
    );

    if (component) {
      setSelectedFork(component);
      setFormData((prev) => ({ ...prev, fork_component_id: component.id }));
    }
  }, [selectedForkBrand, selectedForkYear, selectedForkModel, allComponents]);

  useEffect(() => {
    if (!selectedShockBrand) {
      setShockYears([]);
      setSelectedShockYear("");
      return;
    }

    const filteredComponents = allComponents.filter(
      (c) => c.component_type === "shock" && c.brand === selectedShockBrand
    );
    const uniqueYears = [
      ...new Set(filteredComponents.map((c) => c.year)),
    ].sort((a, b) => b - a);
    setShockYears(uniqueYears);
  }, [selectedShockBrand, allComponents]);

  useEffect(() => {
    if (!selectedShockBrand || !selectedShockYear) {
      setShockModels([]);
      setSelectedShockModel("");
      return;
    }

    const filteredComponents = allComponents.filter(
      (c) =>
        c.component_type === "shock" &&
        c.brand === selectedShockBrand &&
        c.year === Number.parseInt(selectedShockYear)
    );
    const uniqueModels = [...new Set(filteredComponents.map((c) => c.model))];
    setShockModels(uniqueModels);
  }, [selectedShockBrand, selectedShockYear, allComponents]);

  useEffect(() => {
    if (!selectedShockBrand || !selectedShockYear || !selectedShockModel) {
      setSelectedShock(null);
      setFormData((prev) => ({ ...prev, shock_component_id: null }));
      return;
    }

    // Find first matching component for the selected brand, year, and model
    const component = allComponents.find(
      (c) =>
        c.component_type === "shock" &&
        c.brand === selectedShockBrand &&
        c.year === Number.parseInt(selectedShockYear) &&
        c.model === selectedShockModel
    );

    if (component) {
      setSelectedShock(component);
      setFormData((prev) => ({ ...prev, shock_component_id: component.id }));
    }
  }, [
    selectedShockBrand,
    selectedShockYear,
    selectedShockModel,
    allComponents,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const setupData = {
        bike_id: bikeId,
        user_id: userId,
        setup_name: formData.setup_name,
        fork_component_id: forkExpanded ? formData.fork_component_id : null,
        shock_component_id: shockExpanded ? formData.shock_component_id : null,
        fork_hsc:
          forkExpanded && formData.fork_hsc
            ? Number.parseInt(formData.fork_hsc)
            : null,
        fork_lsc:
          forkExpanded && formData.fork_lsc
            ? Number.parseInt(formData.fork_lsc)
            : null,
        fork_hsr:
          forkExpanded && formData.fork_hsr
            ? Number.parseInt(formData.fork_hsr)
            : null,
        fork_lsr:
          forkExpanded && formData.fork_lsr
            ? Number.parseInt(formData.fork_lsr)
            : null,
        fork_compression:
          forkExpanded && formData.fork_compression
            ? Number.parseInt(formData.fork_compression)
            : null,
        fork_rebound:
          forkExpanded && formData.fork_rebound
            ? Number.parseInt(formData.fork_rebound)
            : null,
        fork_air_pressure:
          forkExpanded && formData.fork_air_pressure
            ? Number.parseFloat(formData.fork_air_pressure)
            : null,
        // Fixed field name to match database
        fork_ramp_chamber_pressure:
          forkExpanded && formData.fork_ramp_chamber_pressure
            ? Number.parseFloat(formData.fork_ramp_chamber_pressure)
            : null,
        fork_volume_spacers:
          forkExpanded && formData.fork_volume_spacers
            ? Number.parseInt(formData.fork_volume_spacers)
            : null,
        fork_spring_rate:
          forkExpanded && formData.fork_spring_rate
            ? Number.parseFloat(formData.fork_spring_rate)
            : null,
        fork_notes: forkExpanded ? formData.fork_notes || null : null,
        shock_hsc:
          shockExpanded && formData.shock_hsc
            ? Number.parseInt(formData.shock_hsc)
            : null,
        shock_lsc:
          shockExpanded && formData.shock_lsc
            ? Number.parseInt(formData.shock_lsc)
            : null,
        shock_hsr:
          shockExpanded && formData.shock_hsr
            ? Number.parseInt(formData.shock_hsr)
            : null,
        shock_lsr:
          shockExpanded && formData.shock_lsr
            ? Number.parseInt(formData.shock_lsr)
            : null,
        shock_compression:
          shockExpanded && formData.shock_compression
            ? Number.parseInt(formData.shock_compression)
            : null,
        shock_rebound:
          shockExpanded && formData.shock_rebound
            ? Number.parseInt(formData.shock_rebound)
            : null,
        shock_air_pressure:
          shockExpanded && formData.shock_air_pressure
            ? Number.parseFloat(formData.shock_air_pressure)
            : null,
        // Fixed field name to match database
        shock_ramp_chamber_pressure:
          shockExpanded && formData.shock_ramp_chamber_pressure
            ? Number.parseFloat(formData.shock_ramp_chamber_pressure)
            : null,
        shock_volume_spacers:
          shockExpanded && formData.shock_volume_spacers
            ? Number.parseInt(formData.shock_volume_spacers)
            : null,
        shock_spring_rate:
          shockExpanded && formData.shock_spring_rate
            ? Number.parseFloat(formData.shock_spring_rate)
            : null,
        shock_notes: shockExpanded ? formData.shock_notes || null : null,
        notes: formData.notes || null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("suspension_setups")
          .update({
            ...setupData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", setupId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("suspension_setups")
          .insert(setupData);
        if (error) throw error;
      }

      router.push(`/dashboard/bikes/${bikeId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFork = () => {
    setForkExpanded(false);
    setSelectedFork(null);
    setSelectedForkBrand("");
    setSelectedForkYear("");
    setSelectedForkModel("");
    setFormData((prev) => ({
      ...prev,
      fork_component_id: null,
      fork_hsc: "",
      fork_lsc: "",
      fork_hsr: "",
      fork_lsr: "",
      fork_compression: "",
      fork_rebound: "",
      fork_air_pressure: "",
      fork_ramp_chamber_pressure: "", // Fixed field name
      fork_volume_spacers: "",
      fork_spring_rate: "",
      fork_notes: "",
    }));
  };

  const handleRemoveShock = () => {
    setShockExpanded(false);
    setSelectedShock(null);
    setSelectedShockBrand("");
    setSelectedShockYear("");
    setSelectedShockModel("");
    setFormData((prev) => ({
      ...prev,
      shock_component_id: null,
      shock_hsc: "",
      shock_lsc: "",
      shock_hsr: "",
      shock_lsr: "",
      shock_compression: "",
      shock_rebound: "",
      shock_air_pressure: "",
      shock_ramp_chamber_pressure: "", // Fixed field name
      shock_volume_spacers: "",
      shock_spring_rate: "",
      shock_notes: "",
    }));
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

      <Card>
        <CardContent className="pt-6">
          {!forkExpanded ? (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2 border-dashed bg-transparent"
              onClick={() => setForkExpanded(true)}
            >
              <Plus className="h-4 w-4" />
              Add Fork
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Fork Component</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFork}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="fork_brand">Brand</Label>
                  <Select
                    onValueChange={setSelectedForkBrand}
                    value={selectedForkBrand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {forkBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fork_year">Year</Label>
                  <Select
                    onValueChange={setSelectedForkYear}
                    value={selectedForkYear}
                    disabled={!selectedForkBrand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {forkYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fork_model">Model</Label>
                  <Select
                    onValueChange={setSelectedForkModel}
                    value={selectedForkModel}
                    disabled={!selectedForkYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {forkModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedFork && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Fork Settings</h4>

                  {selectedFork.damper_name && (
                    <p className="text-sm text-muted-foreground">
                      Damper: {selectedFork.damper_name}
                    </p>
                  )}

                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-muted-foreground">
                      Damper Adjustments
                    </h5>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Compression adjustments - either split (HSC/LSC) or generic */}
                      {selectedFork.available_adjustments.hsc &&
                      selectedFork.available_adjustments.lsc ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="fork_hsc">HSC (clicks)</Label>
                            <Input
                              id="fork_hsc"
                              type="number"
                              min="0"
                              placeholder="0"
                              value={formData.fork_hsc}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  fork_hsc: e.target.value,
                                })
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
                                setFormData({
                                  ...formData,
                                  fork_lsc: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      ) : selectedFork.available_adjustments.compression ? (
                        <div className="space-y-2">
                          <Label htmlFor="fork_compression">
                            Compression (clicks)
                          </Label>
                          <Input
                            id="fork_compression"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.fork_compression}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fork_compression: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : null}

                      {/* Rebound adjustments - either split (HSR/LSR) or generic */}
                      {selectedFork.available_adjustments.hsr &&
                      selectedFork.available_adjustments.lsr ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="fork_hsr">HSR (clicks)</Label>
                            <Input
                              id="fork_hsr"
                              type="number"
                              min="0"
                              placeholder="0"
                              value={formData.fork_hsr}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  fork_hsr: e.target.value,
                                })
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
                                setFormData({
                                  ...formData,
                                  fork_lsr: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      ) : selectedFork.available_adjustments.rebound ? (
                        <div className="space-y-2">
                          <Label htmlFor="fork_rebound">Rebound (clicks)</Label>
                          <Input
                            id="fork_rebound"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.fork_rebound}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fork_rebound: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-muted-foreground">
                      Spring Settings
                    </h5>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {selectedFork.available_adjustments.air_pressure && (
                        <div className="space-y-2">
                          <Label htmlFor="fork_air_pressure">
                            Air Pressure (PSI)
                          </Label>
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
                      )}
                      {selectedFork.available_adjustments.has_ramp_chamber && (
                        <div className="space-y-2">
                          <Label htmlFor="fork_ramp_chamber_pressure">
                            Ramp Chamber Pressure (PSI)
                          </Label>
                          <Input
                            id="fork_ramp_chamber_pressure"
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="50"
                            value={formData.fork_ramp_chamber_pressure}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fork_ramp_chamber_pressure: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                      {selectedFork.available_adjustments.volume_spacers && (
                        <div className="space-y-2">
                          <Label htmlFor="fork_volume_spacers">
                            Volume Spacers
                          </Label>
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
                      )}
                      {selectedFork.available_adjustments.spring_rate && (
                        <div className="space-y-2">
                          <Label htmlFor="fork_spring_rate">
                            Spring Rate (lb/in)
                          </Label>
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
                      )}
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
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {!shockExpanded ? (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2 border-dashed bg-transparent"
              onClick={() => setShockExpanded(true)}
            >
              <Plus className="h-4 w-4" />
              Add Shock
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shock Component</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveShock}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="shock_brand">Brand</Label>
                  <Select
                    onValueChange={setSelectedShockBrand}
                    value={selectedShockBrand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {shockBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shock_year">Year</Label>
                  <Select
                    onValueChange={setSelectedShockYear}
                    value={selectedShockYear}
                    disabled={!selectedShockBrand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {shockYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shock_model">Model</Label>
                  <Select
                    onValueChange={setSelectedShockModel}
                    value={selectedShockModel}
                    disabled={!selectedShockYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {shockModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedShock && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Shock Settings</h4>

                  {selectedShock.damper_name && (
                    <p className="text-sm text-muted-foreground">
                      Damper: {selectedShock.damper_name}
                    </p>
                  )}

                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-muted-foreground">
                      Damper Adjustments
                    </h5>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Compression adjustments - either split (HSC/LSC) or generic */}
                      {selectedShock.available_adjustments.hsc &&
                      selectedShock.available_adjustments.lsc ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="shock_hsc">HSC (clicks)</Label>
                            <Input
                              id="shock_hsc"
                              type="number"
                              min="0"
                              placeholder="0"
                              value={formData.shock_hsc}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shock_hsc: e.target.value,
                                })
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
                                setFormData({
                                  ...formData,
                                  shock_lsc: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      ) : selectedShock.available_adjustments.compression ? (
                        <div className="space-y-2">
                          <Label htmlFor="shock_compression">
                            Compression (clicks)
                          </Label>
                          <Input
                            id="shock_compression"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.shock_compression}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shock_compression: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : null}

                      {/* Rebound adjustments - either split (HSR/LSR) or generic */}
                      {selectedShock.available_adjustments.hsr &&
                      selectedShock.available_adjustments.lsr ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="shock_hsr">HSR (clicks)</Label>
                            <Input
                              id="shock_hsr"
                              type="number"
                              min="0"
                              placeholder="0"
                              value={formData.shock_hsr}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shock_hsr: e.target.value,
                                })
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
                                setFormData({
                                  ...formData,
                                  shock_lsr: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      ) : selectedShock.available_adjustments.rebound ? (
                        <div className="space-y-2">
                          <Label htmlFor="shock_rebound">
                            Rebound (clicks)
                          </Label>
                          <Input
                            id="shock_rebound"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.shock_rebound}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shock_rebound: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-muted-foreground">
                      Spring Settings
                    </h5>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {selectedShock.available_adjustments.air_pressure && (
                        <div className="space-y-2">
                          <Label htmlFor="shock_air_pressure">
                            Air Pressure (PSI)
                          </Label>
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
                      )}
                      {selectedShock.available_adjustments.has_ramp_chamber && (
                        <div className="space-y-2">
                          <Label htmlFor="shock_ramp_chamber_pressure">
                            Ramp Chamber Pressure (PSI)
                          </Label>
                          <Input
                            id="shock_ramp_chamber_pressure"
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="550"
                            value={formData.shock_ramp_chamber_pressure}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shock_ramp_chamber_pressure: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                      {selectedShock.available_adjustments.volume_spacers && (
                        <div className="space-y-2">
                          <Label htmlFor="shock_volume_spacers">
                            Volume Spacers
                          </Label>
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
                      )}
                      {selectedShock.available_adjustments.spring_rate && (
                        <div className="space-y-2">
                          <Label htmlFor="shock_spring_rate">
                            Spring Rate (lb/in)
                          </Label>
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
                      )}
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
                        setFormData({
                          ...formData,
                          shock_notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>General Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="General notes about this setup (trail conditions, riding style, etc.)"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : isEditing ? "Update Setup" : "Save Setup"}
        </Button>
      </div>
    </form>
  );
}
