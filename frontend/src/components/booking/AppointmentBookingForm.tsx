import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { createAppointment } from "@/api/appointments"
import { listServices } from "@/api/services"
import { DateTimePicker } from "@/components/booking/DateTimePicker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { clearBookingDraft, getBookingDraft } from "@/lib/auth"
import { formatCurrency } from "@/lib/format"
import type { Service } from "@/lib/types"

export function AppointmentBookingForm() {
  const navigate = useNavigate()

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [serviceId, setServiceId] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [dentalConcern, setDentalConcern] = useState("")

  const selectedService = services.find(
    (service) => String(service.id) === serviceId
  )

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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="service">Service</FieldLabel>
            <Select
              onValueChange={(value) => setServiceId(value ?? "")}
              value={serviceId || undefined}
            >
              <SelectTrigger id="service" className="w-full">
                {selectedService ? (
                  <span className="text-foreground">
                    {selectedService.title} -{" "}
                    {formatCurrency(selectedService.price)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Select a service
                  </span>
                )}
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.title} - {formatCurrency(service.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              {selectedService
                ? `You selected: ${selectedService.title} - ${formatCurrency(
                    selectedService.price
                  )}`
                : "Choose the dental service you need."}
            </FieldDescription>
          </Field>

          <DateTimePicker
            value={appointmentDate}
            onChange={setAppointmentDate}
          />

          <Field>
            <FieldLabel htmlFor="dental_concern">
              Dental Concern (optional)
            </FieldLabel>
            <Input
              id="dental_concern"
              placeholder="e.g. Toothache, cleaning, checkup"
              value={dentalConcern}
              onChange={(e) => setDentalConcern(e.target.value)}
            />
          </Field>

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
