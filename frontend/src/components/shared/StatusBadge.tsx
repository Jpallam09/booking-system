import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import type { AppointmentStatus } from "@/lib/types"

type StatusVariant = "info" | "success" | "warning" | "destructive" | "outline"

const STATUS_VARIANTS: Record<AppointmentStatus, StatusVariant> = {
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "destructive",
}

export function StatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus
  className?: ComponentProps<typeof Badge>["className"]
}) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={className}>
      {status}
    </Badge>
  )
}
