import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"

import {
  deleteService,
  getService,
  updateService,
  type ServicePayload,
} from "@/api/services"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { formatCurrency } from "@/lib/format"

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const serviceId = Number(id)
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const queryClient = useQueryClient()

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => getService(serviceId),
    enabled: !Number.isNaN(serviceId),
  })

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ServicePayload | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const updateMutation = useMutation({
    mutationFn: () =>
      form ? updateService(serviceId, form) : Promise.reject(),
    onSuccess: (updated) => {
      setEditing(false)
      setForm(null)
      queryClient.setQueryData(["service", serviceId], updated)
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
    onError: (err) => {
      const response = (
        err as { response?: { data?: { errors?: Record<string, string[]> } } }
      )?.response?.data
      const messages = response?.errors
      setFormError(
        messages
          ? Object.values(messages).flat().join(" ")
          : "Failed to update service."
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteService(serviceId),
    onSuccess: () => {
      window.location.href = "/services"
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (!service) return <p>Service not found.</p>

  const startEdit = () => {
    setForm({
      title: service.title,
      description: service.description,
      price: service.price,
      duration_minutes: service.duration_minutes,
      status: service.status,
    })
    setFormError(null)
    setEditing(true)
  }

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" render={<Link to="/services" />}>
            Back
          </Button>
          <Badge
            variant={service.status === "active" ? "default" : "secondary"}
          >
            {service.status}
          </Badge>
        </div>
        {isAdmin && !editing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={startEdit}>
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (window.confirm("Delete this service?")) {
                  deleteMutation.mutate()
                }
              }}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {editing && form ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateMutation.mutate()
              }}
              className="grid gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, title: e.target.value } : f))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) =>
                      f ? { ...f, description: e.target.value } : f
                    )
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => (f ? { ...f, price: e.target.value } : f))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={form.duration_minutes}
                    onChange={(e) =>
                      setForm((f) =>
                        f
                          ? { ...f, duration_minutes: Number(e.target.value) }
                          : f
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="h-8 border border-input bg-background px-2.5 text-xs"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) =>
                      f
                        ? {
                            ...f,
                            status: e.target.value as ServicePayload["status"],
                          }
                        : f
                    )
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {formError && (
                <p className="text-xs text-destructive">{formError}</p>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="grid gap-3 pt-6 text-sm">
            <div>
              <h2 className="font-heading text-lg font-semibold">
                {service.title}
              </h2>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground">Price</span>
              <span>{formatCurrency(service.price)}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground">Duration</span>
              <span>{service.duration_minutes} minutes</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground">Status</span>
              <span>{service.status}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
