"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bike, Trash2 } from "lucide-react";
import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface BikeDetailsProps {
  bike: {
    id: string;
    brand: string;
    model: string;
    year: number;
    frame_details: string | null;
  };
}

export function BikeDetails({ bike }: BikeDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${bike.brand} ${bike.model}? This will also delete all associated suspension setups.`
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase.from("bikes").delete().eq("id", bike.id);

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error deleting bike:", error);
      alert("Failed to delete bike. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            {bike.brand} {bike.model} ({bike.year})
          </CardTitle>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Bike
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {bike.frame_details && (
          <p className="text-muted-foreground">{bike.frame_details}</p>
        )}
      </CardContent>
    </Card>
  );
}
