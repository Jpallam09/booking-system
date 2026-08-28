import { AppointmentBookingForm } from "@/components/booking/AppointmentBookingForm"

export function NewAppointmentPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 font-heading text-xl font-semibold">
        Book an Appointment
      </h1>
      <AppointmentBookingForm />
    </div>
  )
}
