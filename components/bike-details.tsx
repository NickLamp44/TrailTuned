import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bike } from "lucide-react"

interface BikeDetailsProps {
  bike: {
    id: string
    brand: string
    model: string
    year: number
    frame_details: string | null
  }
}

export function BikeDetails({ bike }: BikeDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bike className="h-6 w-6 text-primary" />
          {bike.brand} {bike.model} ({bike.year})
        </CardTitle>
      </CardHeader>
      <CardContent>{bike.frame_details && <p className="text-muted-foreground">{bike.frame_details}</p>}</CardContent>
    </Card>
  )
}
