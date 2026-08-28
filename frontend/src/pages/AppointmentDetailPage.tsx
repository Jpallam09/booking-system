import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import {
  assignDentist,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  deleteAppointment,
  getAppointment,
} from "@/api/appointments"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const appointmentId = Number(id)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [cancellationReason, setCancellationReason] = useState("")
  const [dentistId, setDentistId] = useState("")

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getAppointment(appointmentId),
    enabled: !Number.isNaN(appointmentId),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] })
    queryClient.invalidateQueries({ queryKey: ["appointments"] })
  }

  const confirmMutation = useMutation({
    mutationFn: () => confirmAppointment(appointmentId),
    onSuccess: invalidate,
  })
  const completeMutation = useMutation({
    mutationFn: () => completeAppointment(appointmentId),
    onSuccess: invalidate,
  })
  const cancelMutation = useMutation({
    mutationFn: () => cancelAppointment(appointmentId, cancellationReason),
    onSuccess: () => {
      setCancellationReason("")
      invalidate()
    },
  })
  const assignMutation = useMutation({
    mutationFn: () => assignDentist(appointmentId, Number(dentistId)),
    onSuccess: () => {
      setDentistId("")
      invalidate()
    },
  })
  const deleteMutation = useMutation({
    mutationFn: () => deleteAppointment(appointmentId),
    onSuccess: () => {
      window.location.href = "/appointments"
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (!appointment) return <p>Appointment not found.</p>

  const canConfirm =
    (user?.role === "admin" ||
      (user?.role === "dentist" && appointment.dentist_id === user.id)) &&
    appointment.status === "pending"

  const canComplete = canConfirm && appointment.status === "confirmed"

  const canCancel =
    user?.role === "admin" ||
    (user?.role === "patient" && appointment.patient_id === user.id)

  const canAssign = user?.role === "admin"
  const canDelete = user?.role === "admin"

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold">
            Appointment #{appointment.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(appointment.appointment_date)}
          </p>
        </div>
        <Badge variant={STATUS_COLORS[appointment.status]}>
          {appointment.status}
        </Badge>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-6 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service</span>
            <span>{appointment.service?.title ?? "-"}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-muted-foreground">Patient</span>
            <span>{appointment.patient?.name ?? "-"}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-muted-foreground">Dentist</span>
            <span>{appointment.dentist?.name ?? "Not assigned"}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="text-muted-foreground">Dental Concern</span>
            <span className="text-right">
              {appointment.dental_concern ?? "-"}
            </span>
          </div>
          {appointment.cancellation_reason && (
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground">Cancellation Reason</span>
              <span className="text-right">
                {appointment.cancellation_reason} ({appointment.cancelled_by})
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {canConfirm && appointment.status === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Confirm this appointment to finalize it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
            >
              Confirm Appointment
            </Button>
          </CardContent>
        </Card>
      )}

      {canComplete && appointment.status === "confirmed" && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Service</CardTitle>
            <CardDescription>
              Mark this appointment as completed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
            >
              Complete Appointment
            </Button>
          </CardContent>
        </Card>
      )}

      {canCancel && appointment.status !== "cancelled" && (
        <Card>
          <CardHeader>
            <CardTitle>Cancel Appointment</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="Required"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending || !cancellationReason}
            >
              Cancel Appointment
            </Button>
          </CardContent>
        </Card>
      )}

      {canAssign && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Dentist</CardTitle>
            <CardDescription>
              Enter the dentist user ID to assign them to this appointment.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="dentist_id">Dentist ID</Label>
              <Input
                id="dentist_id"
                type="number"
                placeholder="e.g. 2"
                value={dentistId}
                onChange={(e) => setDentistId(e.target.value)}
              />
            </div>
            <Button
              onClick={() => assignMutation.mutate()}
              disabled={assignMutation.isPending || !dentistId}
            >
              Assign Dentist
            </Button>
          </CardContent>
        </Card>
      )}

      {canDelete && (
        <Card>
          <CardHeader>
            <CardTitle>Delete Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => {
                if (window.confirm("Delete this appointment permanently?")) {
                  deleteMutation.mutate()
                }
              }}
              disabled={deleteMutation.isPending}
            >
              Delete Appointment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
