import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { listAppointments } from "@/api/appointments"
import { listServices } from "@/api/services"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination } from "@/components/shared/Pagination"
import { useAuth } from "@/context/AuthContext"
import { formatDate } from "@/lib/format"
import type { AppointmentStatus } from "@/lib/types"

const STATUS_OPTIONS: Array<AppointmentStatus | ""> = [
  "",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]

const STATUS_COLORS: Record<
  AppointmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
}

export function AppointmentsListPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [status, setStatus] = useState<AppointmentStatus | "">(
    (searchParams.get("status") as AppointmentStatus | "") ?? ""
  )
  const [serviceId, setServiceId] = useState(
    searchParams.get("service_id") ?? ""
  )
  const [from, setFrom] = useState(searchParams.get("from") ?? "")
  const [to, setTo] = useState(searchParams.get("to") ?? "")
  const page = Number(searchParams.get("page") ?? 1)

  const appointmentQuery = useQuery({
    queryKey: ["appointments", { search, status, serviceId, from, to, page }],
    queryFn: () =>
      listAppointments({
        search: search || undefined,
        status: status || undefined,
        service_id: serviceId || undefined,
        from: from || undefined,
        to: to || undefined,
        page,
      }),
  })

  const servicesQuery = useQuery({
    queryKey: ["services", "all"],
    queryFn: () => listServices({ per_page: "100" }),
  })

  const applyFilters = () => {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (status) params.status = status
    if (serviceId) params.service_id = serviceId
    if (from) params.from = from
    if (to) params.to = to
    setSearchParams(params)
  }

  const setPage = (next: number) => {
    const params = Object.fromEntries(searchParams.entries())
    params.page = String(next)
    setSearchParams(params)
  }

  const paginated = appointmentQuery.data
  const appointments = paginated?.data ?? []
  const services = servicesQuery.data?.data ?? []

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            {user?.role === "patient"
              ? "Your appointments"
              : user?.role === "dentist"
                ? "Appointments assigned to you"
                : "All appointments"}
          </p>
        </div>
        {user?.role === "patient" && (
          <Button render={<Link to="/appointments/new" />}>
            Book Appointment
          </Button>
        )}
      </div>

      <div className="grid gap-3 rounded-none border p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="grid gap-1.5 lg:col-span-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search patient, service, concern"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status || undefined}
            onValueChange={(v) => {
              const raw = String(v ?? "")
              setStatus(
                (raw === "" || raw === "any" ? "" : raw) as AppointmentStatus
              )
            }}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s || "any"} value={s || "any"}>
                  {s ? s.charAt(0).toUpperCase() + s.slice(1) : "Any"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="service">Service</Label>
          <Select
            value={serviceId || undefined}
            onValueChange={(v) => {
              const raw = String(v ?? "")
              setServiceId(raw === "" || raw === "any" ? "" : raw)
            }}
          >
            <SelectTrigger id="service" className="w-full">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {services.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={applyFilters} className="w-full">
            Apply
          </Button>
        </div>
      </div>

      <div className="rounded-none border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointmentQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!appointmentQuery.isLoading && appointments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <Link
                    to={`/appointments/${appointment.id}`}
                    className="text-primary underline underline-offset-4"
                  >
                    #{appointment.id}
                  </Link>
                </TableCell>
                <TableCell>{appointment.patient?.name ?? "-"}</TableCell>
                <TableCell>{appointment.service?.title ?? "-"}</TableCell>
                <TableCell>
                  {formatDate(appointment.appointment_date)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_COLORS[appointment.status]}>
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginated && (
        <Pagination
          page={paginated.current_page}
          lastPage={paginated.last_page}
          total={paginated.total}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
