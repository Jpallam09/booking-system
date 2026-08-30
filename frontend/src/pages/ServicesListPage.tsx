import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

import { listServices } from "@/api/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination } from "@/components/shared/Pagination"
import { ServiceCard } from "@/components/services/ServiceCard"
import { useAuth } from "@/context/AuthContext"
import type { ServicePayload } from "@/api/services"

export function ServicesListPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [appliedParams, setAppliedParams] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ["services", appliedParams, page],
    queryFn: () =>
      listServices({
        search: appliedParams.search,
        status: (appliedParams.status as ServicePayload["status"]) || undefined,
        min_price: appliedParams.min_price || undefined,
        max_price: appliedParams.max_price || undefined,
        page,
      }),
  })

  const applyFilters = () => {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (status) params.status = status
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice
    setAppliedParams(params)
    setPage(1)
  }

  const paginated = query.data
  const services = paginated?.data ?? []

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold">Services</h1>
          <p className="text-sm text-muted-foreground">
            Dental services offered at our clinic.
          </p>
        </div>
        {isAdmin && (
          <Button render={<Link to="/services/new" />}>New Service</Button>
        )}
      </div>

      <div className="grid gap-3 rounded-none border p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="grid gap-1.5 lg:col-span-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search title/description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="h-8 border border-input bg-background px-2.5 text-xs"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Any</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="min_price">Min Price</Label>
          <Input
            id="min_price"
            type="number"
            step="0.01"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="max_price">Max Price</Label>
          <Input
            id="max_price"
            type="number"
            step="0.01"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={applyFilters} className="w-full">
            Apply
          </Button>
        </div>
      </div>

      {query.isLoading && (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
      {!query.isLoading && services.length === 0 && (
        <p className="text-sm text-muted-foreground">No services found.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
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
