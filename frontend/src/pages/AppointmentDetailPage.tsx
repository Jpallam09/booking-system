import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { CheckCircle2Icon, Loader2Icon } from "lucide-react"

import {
  assignDentist,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  deleteAppointment,
  getAppointment,
  updateAppointment,
} from "@/api/appointments"
import { listUsers } from "@/api/users"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
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

const TABS = [
  { id: 1, label: "Overview" },
  { id: 2, label: "Assign" },
  { id: 3, label: "Confirm" },
  { id: 4, label: "More" },
] as const

function toDateTimeLocal(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

function isoToDateTimeLocal(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 16)
  return toDateTimeLocal(date)
}

function extractError(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const message = (error as { response?: { data?: { message?: string } } })
      .response?.data?.message
    if (typeof message === "string") return message
  }
  if (error instanceof Error && error.message) return error.message
  return "Something went wrong."
}

export function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const appointmentId = Number(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1)
  const [cancellationReason, setCancellationReason] = useState("")
  const [dentistId, setDentistId] = useState("")
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [showReassign, setShowReassign] = useState(false)

  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getAppointment(appointmentId),
    enabled: !Number.isNaN(appointmentId),
  })

  const dentistsQuery = useQuery({
    queryKey: ["users", "dentists"],
    queryFn: () => listUsers({ role: "dentist" }),
    enabled: user?.role === "admin",
  })
  const dentists = dentistsQuery.data ?? []

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] })
    queryClient.invalidateQueries({ queryKey: ["appointments"] })
  }

  useEffect(() => {
    if (appointment && dentistId === "" && appointment.dentist_id != null) {
      setDentistId(String(appointment.dentist_id))
    }
  }, [appointment, dentistId])

  useEffect(() => {
    if (appointment && rescheduleDate === "") {
      setRescheduleDate(isoToDateTimeLocal(appointment.appointment_date))
    }
  }, [appointment, rescheduleDate])

  const confirmMutation = useMutation({
    mutationFn: () => confirmAppointment(appointmentId),
    onSuccess: () => {
      toast.add({ title: "Appointment confirmed", type: "success" })
      invalidate()
    },
    onError: (error) =>
      toast.add({
        title: "Could not confirm appointment",
        description: extractError(error),
        type: "error",
      }),
  })
  const completeMutation = useMutation({
    mutationFn: () => completeAppointment(appointmentId),
    onSuccess: () => {
      toast.add({ title: "Appointment completed", type: "success" })
      invalidate()
    },
    onError: (error) =>
      toast.add({
        title: "Could not complete appointment",
        description: extractError(error),
        type: "error",
      }),
  })
  const assignMutation = useMutation({
    mutationFn: () => assignDentist(appointmentId, Number(dentistId)),
    onSuccess: () => {
      setShowReassign(false)
      setActiveTab(3)
      toast.add({ title: "Dentist assigned", type: "success" })
      invalidate()
    },
    onError: (error) =>
      toast.add({
        title: "Could not assign dentist",
        description: extractError(error),
        type: "error",
      }),
  })
  const rescheduleMutation = useMutation({
    mutationFn: () =>
      updateAppointment(appointmentId, {
        appointment_date: rescheduleDate,
      }),
    onSuccess: () => {
      setRescheduleDate("")
      toast.add({ title: "Appointment rescheduled", type: "success" })
      invalidate()
    },
    onError: (error) =>
      toast.add({
        title: "Could not reschedule appointment",
        description: extractError(error),
        type: "error",
      }),
  })
  const cancelMutation = useMutation({
    mutationFn: () => cancelAppointment(appointmentId, cancellationReason),
    onSuccess: () => {
      setCancellationReason("")
      toast.add({ title: "Appointment cancelled", type: "success" })
      invalidate()
    },
    onError: (error) =>
      toast.add({
        title: "Could not cancel appointment",
        description: extractError(error),
        type: "error",
      }),
  })
  const deleteMutation = useMutation({
    mutationFn: () => deleteAppointment(appointmentId),
    onSuccess: () => {
      toast.add({ title: "Appointment deleted", type: "success" })
      navigate("/appointments")
    },
    onError: (error) =>
      toast.add({
        title: "Could not delete appointment",
        description: extractError(error),
        type: "error",
      }),
  })

  if (isLoading) return <p>Loading...</p>
  if (!appointment) return <p>Appointment not found.</p>

  const isOwner = user?.role === "patient" && appointment.patient_id === user.id
  const isAdmin = user?.role === "admin"
  const assigned = appointment.dentist_id != null
  const canEdit = isAdmin || isOwner
  const canConfirm =
    (isAdmin ||
      (user?.role === "dentist" && appointment.dentist_id === user.id)) &&
    appointment.status === "pending"
  const canComplete = canConfirm && appointment.status === "confirmed"
  const canCancel = canEdit && appointment.status !== "cancelled"
  const minReschedule = toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000))

  if (isAdmin) {
    if (appointment.status === "cancelled") {
      return (
        <div className="mx-auto w-full max-w-xl">
          <Card>
            <CardContent className="grid gap-4 pt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="grid gap-0.5">
                  <h1 className="font-heading text-lg font-semibold">
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

              <div className="grid gap-3 border-t pt-4 text-sm">
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
                  <div className="grid gap-1 border-t border-destructive/30 bg-destructive/10 p-3 pt-3">
                    <span className="text-xs font-medium text-destructive">
                      Cancellation Reason
                    </span>
                    <p className="text-right">
                      {appointment.cancellation_reason}
                      {appointment.cancelled_by &&
                        ` (${appointment.cancelled_by})`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="mx-auto w-full max-w-xl">
        <Card>
          <CardContent className="grid gap-5">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 border bg-muted/50 p-1">
                {TABS.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id as 1 | 2 | 3 | 4)}
                    aria-pressed={activeTab === tab.id}
                    className={
                      activeTab === tab.id ? "" : "text-muted-foreground"
                    }
                  >
                    {tab.id} · {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {activeTab === 1 && (
              <div className="grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="grid gap-0.5">
                    <h1 className="font-heading text-lg font-semibold">
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

                <div className="grid gap-3 border-t pt-4 text-sm">
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
                    <span className="text-muted-foreground">
                      Dental Concern
                    </span>
                    <span className="text-right">
                      {appointment.dental_concern ?? "-"}
                    </span>
                  </div>
                  {appointment.cancellation_reason && (
                    <div className="grid gap-1 border-t border-destructive/30 bg-destructive/10 p-3 pt-3">
                      <span className="text-xs font-medium text-destructive">
                        Cancellation Reason
                      </span>
                      <p className="text-right">
                        {appointment.cancellation_reason}
                        {appointment.cancelled_by &&
                          ` (${appointment.cancelled_by})`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="grid gap-3">
                {assignMutation.isPending ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2Icon className="size-4 animate-spin" />
                    Assigning dentist...
                  </p>
                ) : assigned && !showReassign ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2Icon className="size-4 text-primary" />
                      <span>
                        <span className="text-muted-foreground">Dentist:</span>{" "}
                        <span className="font-medium">
                          {appointment.dentist?.name ?? "-"}
                        </span>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReassign(true)}
                    >
                      Reassign
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="dentist">Dentist</Label>
                      <Select
                        value={dentistId || undefined}
                        onValueChange={(v) => setDentistId(String(v ?? ""))}
                      >
                        <SelectTrigger id="dentist" className="w-full">
                          <SelectValue placeholder="Select a dentist" />
                        </SelectTrigger>
                        <SelectContent>
                          {dentists.map((dentist) => (
                            <SelectItem
                              key={dentist.id}
                              value={String(dentist.id)}
                            >
                              {dentist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {assignMutation.isError && (
                      <p className="text-xs text-destructive">
                        {extractError(assignMutation.error)}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => assignMutation.mutate()}
                        disabled={!dentistId || assignMutation.isPending}
                      >
                        {assigned ? "Save Dentist" : "Assign Dentist"}
                      </Button>
                      {assigned && (
                        <Button
                          variant="ghost"
                          onClick={() => setShowReassign(false)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 3 && (
              <div className="grid gap-3">
                {appointment.status === "completed" ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2Icon className="size-4 text-primary" />
                    This appointment has been completed.
                  </p>
                ) : appointment.status === "confirmed" ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      This appointment is confirmed. Complete it once the
                      service is done.
                    </p>
                    <Button
                      onClick={() => completeMutation.mutate()}
                      disabled={completeMutation.isPending}
                    >
                      {completeMutation.isPending && (
                        <Loader2Icon className="size-4 animate-spin" />
                      )}
                      Complete Appointment
                    </Button>
                    {completeMutation.isError && (
                      <p className="text-xs text-destructive">
                        {extractError(completeMutation.error)}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="grid gap-1">
                      <p className="text-sm text-muted-foreground">
                        Confirm the booking for{" "}
                        <span className="font-medium text-foreground">
                          {appointment.service?.title}
                        </span>{" "}
                        on {formatDate(appointment.appointment_date)}.
                      </p>
                      {!assigned && (
                        <p className="text-xs text-destructive">
                          Assign a dentist before confirming.
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => confirmMutation.mutate()}
                      disabled={confirmMutation.isPending || !assigned}
                    >
                      {confirmMutation.isPending && (
                        <Loader2Icon className="size-4 animate-spin" />
                      )}
                      Confirm Appointment
                    </Button>
                    {confirmMutation.isError && (
                      <p className="text-xs text-destructive">
                        {extractError(confirmMutation.error)}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 4 && (
              <div className="grid gap-5 text-sm">
                {appointment.status !== "completed" && (
                  <>
                    <section className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="reschedule_date">
                          New Date &amp; Time
                        </Label>
                        <Input
                          id="reschedule_date"
                          type="datetime-local"
                          min={minReschedule}
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={() => rescheduleMutation.mutate()}
                        disabled={
                          rescheduleMutation.isPending || !rescheduleDate
                        }
                      >
                        {rescheduleMutation.isPending && (
                          <Loader2Icon className="size-4 animate-spin" />
                        )}
                        Save Reschedule
                      </Button>
                      {rescheduleMutation.isError && (
                        <p className="text-xs text-destructive">
                          {extractError(rescheduleMutation.error)}
                        </p>
                      )}
                    </section>
                    <div className="h-px bg-border" />
                  </>
                )}

                <section className="grid gap-3">
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
                    disabled={
                      cancelMutation.isPending || !cancellationReason.trim()
                    }
                  >
                    {cancelMutation.isPending && (
                      <Loader2Icon className="size-4 animate-spin" />
                    )}
                    Cancel Appointment
                  </Button>
                  {cancelMutation.isError && (
                    <p className="text-xs text-destructive">
                      {extractError(cancelMutation.error)}
                    </p>
                  )}
                </section>

                <div className="h-px bg-border" />
                <section className="flex items-center justify-between gap-3">
                  <p className="text-muted-foreground">
                    Permanently remove this appointment from the system.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (
                        window.confirm("Delete this appointment permanently?")
                      ) {
                        deleteMutation.mutate()
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending && (
                      <Loader2Icon className="size-4 animate-spin" />
                    )}
                    Delete
                  </Button>
                </section>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

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

      {canEdit &&
        appointment.status !== "completed" &&
        appointment.status !== "cancelled" && (
          <Card>
            <CardHeader>
              <CardTitle>Reschedule</CardTitle>
              <CardDescription>
                Change the appointment date and time.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="reschedule_date">New Date &amp; Time</Label>
                <Input
                  id="reschedule_date"
                  type="datetime-local"
                  min={minReschedule}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
              </div>
              <Button
                onClick={() => rescheduleMutation.mutate()}
                disabled={rescheduleMutation.isPending || !rescheduleDate}
              >
                Save Reschedule
              </Button>
            </CardContent>
          </Card>
        )}

      {canCancel && (
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
              disabled={cancelMutation.isPending || !cancellationReason.trim()}
            >
              Cancel Appointment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
