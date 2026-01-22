"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Setup {
  id: string;
  setup_name: string;
  fork_component_id: string | null;
  shock_component_id: string | null;
  notes: string | null;
  created_at: string;
}

interface SuspensionComponent {
  brand: string;
  model: string;
  year: number;
}

interface SetupsListProps {
  bikeId: string;
  setups: Setup[];
}

export function SetupsList({ bikeId, setups }: SetupsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [components, setComponents] = useState<
    Record<string, SuspensionComponent>
  >({});
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchComponents = async () => {
      const componentIds = [
        ...setups.map((s) => s.fork_component_id).filter(Boolean),
        ...setups.map((s) => s.shock_component_id).filter(Boolean),
      ];

      if (componentIds.length === 0) return;

      const { data, error } = await supabase
        .from("suspension_components")
        .select("id, brand, model, year")
        .in("id", componentIds);

      if (!error && data) {
        const componentMap = data.reduce((acc, component) => {
          acc[component.id] = {
            brand: component.brand,
            model: component.model,
            year: component.year,
          };
          return acc;
        }, {} as Record<string, SuspensionComponent>);
        setComponents(componentMap);
      }
    };

    fetchComponents();
  }, [setups, supabase]);

  const handleDelete = async (setupId: string, setupName: string) => {
    if (!confirm(`Are you sure you want to delete "${setupName}"?`)) {
      return;
    }

    setDeletingId(setupId);

    try {
      const { error } = await supabase
        .from("suspension_setups")
        .delete()
        .eq("id", setupId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error deleting setup:", error);
      alert("Failed to delete setup. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const getComponentDisplay = (componentId: string | null) => {
    if (!componentId) return "Not configured";
    const component = components[componentId];
    if (!component) return "Loading...";
    return `${component.brand} ${component.model}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Suspension Setups</h3>
        <Link href={`/dashboard/bikes/${bikeId}/setups/add`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Setup
          </Button>
        </Link>
      </div>

      {setups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No suspension setups yet. Add your first setup to start tracking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {setups.map((setup) => (
            <Card key={setup.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      {setup.setup_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDate(setup.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/bikes/${bikeId}/setups/${setup.id}/edit`}
                    >
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(setup.id, setup.setup_name)}
                      disabled={deletingId === setup.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Fork</h4>
                    <p className="text-sm text-muted-foreground">
                      {getComponentDisplay(setup.fork_component_id)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shock</h4>
                    <p className="text-sm text-muted-foreground">
                      {getComponentDisplay(setup.shock_component_id)}
                    </p>
                  </div>
                </div>
                {setup.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {setup.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
