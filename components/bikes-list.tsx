"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BikeIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Bike {
  id: string;
  brand: string;
  model: string;
  year: number;
  frame_details: string | null;
}

interface BikesListProps {
  bikes: Bike[];
}

export function BikesList({ bikes }: BikesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleDelete = async (bikeId: string, bikeName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${bikeName}? This will also delete all associated suspension setups.`
      )
    ) {
      return;
    }

    setDeletingId(bikeId);

    try {
      const { error } = await supabase.from("bikes").delete().eq("id", bikeId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error deleting bike:", error);
      alert("Failed to delete bike. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Link href="/dashboard/bikes/new">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Bike
        </Button>
      </Link>

      {bikes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BikeIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No bikes yet. Add your first bike to start tracking suspension
              setups.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike) => (
            <Card
              key={bike.id}
              className="hover:shadow-lg transition-shadow relative group"
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(bike.id, `${bike.brand} ${bike.model}`);
                }}
                disabled={deletingId === bike.id}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>

              <Link href={`/dashboard/bikes/${bike.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BikeIcon className="h-5 w-5 text-primary" />
                    {bike.brand} {bike.model}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>Year: {bike.year}</p>
                    {bike.frame_details && (
                      <p className="mt-2 line-clamp-2">{bike.frame_details}</p>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
