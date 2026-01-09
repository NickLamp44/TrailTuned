"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface Setup {
  id: string
  setup_name: string
  fork_brand: string | null
  fork_model: string | null
  shock_brand: string | null
  shock_model: string | null
  notes: string | null
  created_at: string
}

interface SetupsListProps {
  bikeId: string
  setups: Setup[]
}

export function SetupsList({ bikeId, setups }: SetupsListProps) {
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
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  {setup.setup_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Created: {formatDate(setup.created_at)}</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Fork</h4>
                    {setup.fork_brand && setup.fork_model ? (
                      <p className="text-sm text-muted-foreground">
                        {setup.fork_brand} {setup.fork_model}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shock</h4>
                    {setup.shock_brand && setup.shock_model ? (
                      <p className="text-sm text-muted-foreground">
                        {setup.shock_brand} {setup.shock_model}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not configured</p>
                    )}
                  </div>
                </div>
                {setup.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{setup.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
