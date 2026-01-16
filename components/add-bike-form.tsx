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

interface AddBikeFormProps {
  userId: string;
}

export function AddBikeForm({ userId }: AddBikeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    frame_details: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.from("bikes").insert({
        user_id: userId,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        frame_details: formData.frame_details || null,
      });

      if (error) throw error;

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bike Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Santa Cruz, Trek, Specialized"
                required
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="e.g., Bronson, Slash, Enduro"
                required
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              min="1990"
              max={new Date().getFullYear() + 1}
              required
              value={formData.year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  year: Number.parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frame_details">Frame Details (Optional)</Label>
            <Textarea
              id="frame_details"
              placeholder="e.g., Size L, carbon frame, 160mm travel..."
              rows={4}
              value={formData.frame_details}
              onChange={(e) =>
                setFormData({ ...formData, frame_details: e.target.value })
              }
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Bike"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
