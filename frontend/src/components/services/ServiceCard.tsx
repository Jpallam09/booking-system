import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import type { Service } from "@/lib/types"

interface ServiceCardProps {
  service: Service
  showAction?: boolean
}

export function ServiceCard({ service, showAction = true }: ServiceCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{service.title}</CardTitle>
          <Badge
            variant={service.status === "active" ? "default" : "secondary"}
          >
            {service.status}
          </Badge>
        </div>
        <CardDescription className="text-base font-semibold text-foreground">
          {formatCurrency(service.price)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">{service.description}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {service.duration_minutes} minutes
        </p>
      </CardContent>
      {showAction && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            nativeButton={false} render={<Link to={`/services/${service.id}`} />}
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
