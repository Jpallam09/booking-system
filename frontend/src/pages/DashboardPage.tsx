import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { listAppointments } from "@/api/appointments"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { formatDate } from "@/lib/format"
import type { AppointmentStatus } from "@/lib/types"

const STATUS_COLORS: Record<
  AppointmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
}

export function DashboardPage() {
  const { user } = useAuth()

  const { data } = useQuery({
    queryKey: ["appointments", "dashboard"],
    queryFn: () => listAppointments({ per_page: "50" }),
  })

  const appointments = data?.data ?? []
  const counts = appointments.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  const stats = [
    {
      label: "Pending",
      value: counts.pending ?? 0,
      status: "pending" as const,
    },
    {
      label: "Confirmed",
      value: counts.confirmed ?? 0,
      status: "confirmed" as const,
    },
    {
      label: "Completed",
      value: counts.completed ?? 0,
      status: "completed" as const,
    },
    {
      label: "Cancelled",
      value: counts.cancelled ?? 0,
      status: "cancelled" as const,
    },
  ]

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Welcome, {user?.name}
        </h1>
        <p className="text-sm text-muted-foreground capitalize">
          Signed in as {user?.role}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.status}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>
              Your latest {appointments.length} appointment(s)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link to="/appointments" />}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3">
          {appointments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No appointments yet.
            </p>
          )}
          {appointments.slice(0, 5).map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between border-t pt-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {appointment.service?.title ?? "Service"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {appointment.patient?.name ?? ""} ·{" "}
                  {formatDate(appointment.appointment_date)}
                </p>
              </div>
              <Badge variant={STATUS_COLORS[appointment.status]}>
                {appointment.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
