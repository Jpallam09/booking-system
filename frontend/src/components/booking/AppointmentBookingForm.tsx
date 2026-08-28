import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { createAppointment } from "@/api/appointments"
import { listServices } from "@/api/services"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
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
import { clearBookingDraft, getBookingDraft } from "@/lib/auth"
import type { Service } from "@/lib/types"

function toDateTimeLocal(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function AppointmentBookingForm() {
  const navigate = useNavigate()

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [serviceId, setServiceId] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [dentalConcern, setDentalConcern] = useState("")

  useEffect(() => {
    listServices()
      .then((paginated) => setServices(paginated.data))
      .catch(() => setError("Could not load services."))
  }, [])

  useEffect(() => {
    const draft = getBookingDraft()
    if (draft) {
      setServiceId(draft.service_id)
      setAppointmentDate(draft.appointment_date)
      setDentalConcern(draft.dental_concern)
    }
  }, [])

  const canSubmit = serviceId && appointmentDate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setError(null)
    try {
      await createAppointment({
        service_id: Number(serviceId),
        appointment_date: appointmentDate,
        dental_concern: dentalConcern || undefined,
      })
      clearBookingDraft()
      navigate("/appointments", {
        state: { booked: true },
      })
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to book appointment."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const initialDate =
    appointmentDate ||
    toDateTimeLocal(new Date(Date.now() + 24 * 60 * 60 * 1000))
  const minDate = toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000))

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <Select
              onValueChange={(value) => setServiceId(value ?? "")}
              value={serviceId || undefined}
            >
              <SelectTrigger id="service" className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.title} - ${Number(service.price).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="appointment_date">Date &amp; Time</Label>
            <Input
              id="appointment_date"
              type="datetime-local"
              min={minDate}
              value={initialDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dental_concern">Dental Concern (optional)</Label>
            <Input
              id="dental_concern"
              placeholder="e.g. Toothache, cleaning, checkup"
              value={dentalConcern}
              onChange={(e) => setDentalConcern(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
