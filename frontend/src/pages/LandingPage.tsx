import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  CalendarHeart,
  Quote,
  RefreshCcw,
  ShieldCheck,
  Star,
} from "lucide-react"

import { listServices } from "@/api/services"
import heroImage from "@/assets/hero.jpg"
import { AppointmentBookingForm } from "@/components/booking/AppointmentBookingForm"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ServiceCard } from "@/components/services/ServiceCard"
import { GridBackground } from "@/components/shared/GridBackground"
import { useAuth } from "@/context/AuthContext"
import type { Service } from "@/lib/types"

const STATS = [
  { value: "15k+", label: "Appointments booked" },
  { value: "12+", label: "Specialist dentists" },
  { value: "4.9★", label: "Average patient rating" },
  { value: "98%", label: "On-time visits" },
]

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Book in seconds",
    description:
      "Browse treatments, pick a slot that suits you and confirm — no phone calls, no waiting on hold.",
  },
  {
    icon: BellRing,
    title: "Smart reminders",
    description:
      "Get a friendly heads-up before your visit so you never miss an appointment again.",
  },
  {
    icon: RefreshCcw,
    title: "Reschedule anytime",
    description:
      "Plans change. Move your appointment online in a couple of taps, no questions asked.",
  },
]

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Patient since 2023",
    quote:
      "I booked a cleaning during my lunch break. The reminder texts stopped me from forgetting — genuinely the easiest dentist visit I've ever had.",
  },
  {
    name: "Marcus Reid",
    role: "Patient since 2022",
    quote:
      "Rescheduling was a breeze when my meeting ran over. Two taps and I had a new slot for the same week.",
  },
  {
    name: "Amara Okafor",
    role: "Patient since 2024",
    quote:
      "The whole family uses it now. The clinic is spotless, the staff are kind and everything just runs on time.",
  },
]

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
    <div className="flex min-h-screen w-full flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center bg-gradient-to-tr from-teal-500 to-cyan-500 text-white">
              <CalendarHeart className="size-5" />
            </span>
            <span className="font-display text-sm font-bold tracking-tight">
              Booking System
            </span>
          </Link>
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
        <section className="relative overflow-hidden">
          <GridBackground />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
            <div>
              {" "}
              <h1 className="mt-5 font-display text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
                Modern dental care, booked in seconds.
              </h1>
              <p className="mt-4 max-w-md text-base text-muted-foreground">
                Browse our services and secure your visit online. Pick a time
                that suits you and our team will confirm your appointment
                shortly no phone calls, no waiting.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button className="px-5" size="lg" onClick={handleBookClick}>
                  Book an Appointment
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-5"
                  render={<a href="#services" />}
                >
                  Browse services
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-2" aria-hidden="true">
                  {["SC", "MR", "AO", "JL"].map((initials) => (
                    <span
                      key={initials}
                      className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-gradient-to-tr from-teal-500 to-cyan-500 text-[10px] font-semibold text-white"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <div className="text-sm">
                  <span
                    className="flex items-center gap-1"
                    aria-label="Rated 4.9 out of 5 stars"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </span>
                  <p className="mt-1 text-muted-foreground">
                    4.9/5 from 2,300+ reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden border bg-card shadow-xl shadow-cyan-900/10">
                <img
                  src={heroImage}
                  alt="Bright modern dental clinic treatment room"
                  className="aspect-4/3 w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-4 hidden items-center gap-2.5 border bg-background px-3 py-2.5 shadow-lg sm:flex">
                <span className="flex size-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <CalendarCheck className="size-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-semibold">Appointment confirmed</p>
                  <p className="text-xs text-muted-foreground">
                    Today at 3:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-4">
          <Card className="p-6 shadow-sm sm:p-8">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold tracking-tight text-teal-700 sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              A calmer way to manage your dental care
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything about your visit, handled before you step through the
              door.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center bg-teal-50 text-teal-700">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="font-display text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-teal-600" />
            Licensed dentists and fully sterilized equipment at every visit.
          </div>
        </section>

        <section
          id="services"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Our Services
              </h2>
              <p className="mt-2 text-muted-foreground">
                From routine check-ups to specialist treatments.
              </p>
            </div>
            <Button variant="ghost" render={<a href="#" />}>
              View all services
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section className="relative border-y">
          <GridBackground />
          <div className="relative mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                Loved by patients, for years
              </h2>
              <p className="mt-3 text-muted-foreground">
                Real experiences from people who booked through our platform.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <Card key={testimonial.name} className="p-6 shadow-sm">
                  <Quote className="size-6 text-teal-600" />
                  <blockquote className="flex-1 text-sm text-muted-foreground">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-9 items-center justify-center rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 text-xs font-semibold text-white"
                    >
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <div className="text-sm">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="overflow-hidden bg-gradient-to-tr from-teal-600 to-cyan-600 px-6 py-14 text-center shadow-xl shadow-cyan-900/20 sm:px-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              Ready to book your next visit?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/85">
              Secure your appointment today and let our team take care of the
              rest.
            </p>
            <Button
              size="lg"
              className="mt-8 bg-white text-teal-700 hover:bg-cyan-50"
              onClick={handleBookClick}
            >
              Book an Appointment
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/10">
              <CalendarHeart className="size-4" />
            </span>
            <span className="font-display text-sm font-bold">
              Booking System
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm opacity-80">
            <a href="#services">Services</a>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </nav>
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} Booking System. All rights reserved.
          </p>
        </div>
      </footer>

      <BookingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
