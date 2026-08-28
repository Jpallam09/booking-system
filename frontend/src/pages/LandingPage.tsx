import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { listServices } from "@/api/services"
import { AppointmentBookingForm } from "@/components/booking/AppointmentBookingForm"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ServiceCard } from "@/components/services/ServiceCard"
import { useAuth } from "@/context/AuthContext"
import type { Service } from "@/lib/types"

function BookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Select a service and pick a time that works for you.
          </DialogDescription>
        </DialogHeader>
        <AppointmentBookingForm />
      </DialogContent>
    </Dialog>
  )
}

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [services, setServices] = useState<Service[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    listServices()
      .then((paginated) => setServices(paginated.data))
      .catch(() => setServices([]))
  }, [])

  const isPatient = user?.role === "patient"

  const handleBookClick = () => {
    if (!isAuthenticated) {
      // Save a placeholder draft so the user can be routed to booking after login.
      navigate(`/login?redirect=${encodeURIComponent("/appointments/new")}`)
      return
    }
    if (isPatient) {
      setDialogOpen(true)
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="font-heading text-sm font-semibold">
            Booking System
          </span>
          <nav className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" render={<Link to="/login" />}>
                  Sign In
                </Button>
                <Button size="sm" render={<Link to="/register" />}>
                  Register
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b bg-muted/40">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="font-heading text-3xl leading-tight font-semibold">
                Modern dental care, book your appointment online.
              </h1>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                Browse our services and secure your visit in a few clicks. Our
                team will confirm your appointment shortly.
              </p>
              <Button className="mt-6" size="lg" onClick={handleBookClick}>
                Book an Appointment
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.slice(0, 4).map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  showAction={false}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-heading text-xl font-semibold">Our Services</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      </main>

      <BookingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
