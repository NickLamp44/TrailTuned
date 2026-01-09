"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BikeIcon } from "lucide-react"
import Link from "next/link"

interface Bike {
  id: string
  brand: string
  model: string
  year: number
  frame_details: string | null
}

interface BikesListProps {
  bikes: Bike[]
}

export function BikesList({ bikes }: BikesListProps) {
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
              No bikes yet. Add your first bike to start tracking suspension setups.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike) => (
            <Link key={bike.id} href={`/dashboard/bikes/${bike.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BikeIcon className="h-5 w-5 text-primary" />
                    {bike.brand} {bike.model}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>Year: {bike.year}</p>
                    {bike.frame_details && <p className="mt-2 line-clamp-2">{bike.frame_details}</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
