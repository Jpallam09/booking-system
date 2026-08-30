import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { Loader2Icon } from "lucide-react"

import {
  deleteService,
  getService,
  updateService,
  type ServicePayload,
} from "@/api/services"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { useAuth } from "@/context/AuthContext"
import { formatCurrency } from "@/lib/format"

function extractError(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const message = (error as { response?: { data?: { message?: string } } })
      .response?.data?.message
    if (typeof message === "string") return message
  }
  if (error instanceof Error && error.message) return error.message
  return "Something went wrong."
}

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

  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<ServicePayload | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const updateMutation = useMutation({
    mutationFn: () =>
      form ? updateService(serviceId, form) : Promise.reject(),
    onSuccess: (updated) => {
      setForm(null)
      setFormError(null)
      setActiveTab(1)
      queryClient.setQueryData(["service", serviceId], updated)
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.add({
        title: "Service updated",
        description: `${updated.title} saved.`,
        type: "success",
      })
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
    setActiveTab(2)
  }

  const tabs = isAdmin
    ? [
        { id: 1, label: "Overview" },
        { id: 2, label: "Edit" },
        { id: 3, label: "More" },
      ]
    : [{ id: 1, label: "Overview" }]
  const safeTab = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : (tabs[0].id as 1 | 2 | 3)

  const overviewPanel = (
    <div className="grid gap-3 text-sm">
      <div>
        <h2 className="font-heading text-lg font-semibold">{service.title}</h2>
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
    </div>
  )

  const editPanel = form && (
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
            setForm((f) => (f ? { ...f, description: e.target.value } : f))
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
                f ? { ...f, duration_minutes: Number(e.target.value) } : f
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
                ? { ...f, status: e.target.value as ServicePayload["status"] }
                : f
            )
          }
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {formError && <p className="text-xs text-destructive">{formError}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && (
            <Loader2Icon className="size-4 animate-spin" />
          )}
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveTab(1)}
          disabled={updateMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )

  const morePanel = (
    <div className="grid gap-3">
      <p className="text-sm text-muted-foreground">
        Delete this service to remove it from the catalog.
      </p>
      <Button
        variant="destructive"
        onClick={() => {
          if (window.confirm("Delete this service?")) {
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
      {deleteMutation.isError && (
        <p className="text-xs text-destructive">
          {extractError(deleteMutation.error)}
        </p>
      )}
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" render={<Link to="/services" />}>
          Back
        </Button>
        <Badge variant={service.status === "active" ? "default" : "secondary"}>
          {service.status}
        </Badge>
      </div>
      <Card>
        <CardContent className="grid gap-5">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 border bg-muted/50 p-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={safeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    tab.id === 2
                      ? startEdit()
                      : setActiveTab(tab.id as 1 | 2 | 3)
                  }
                  aria-pressed={safeTab === tab.id}
                  className={safeTab === tab.id ? "" : "text-muted-foreground"}
                >
                  {tab.id} · {tab.label}
                </Button>
              ))}
            </div>
          </div>

          {safeTab === 1 && overviewPanel}
          {isAdmin && safeTab === 2 && editPanel}
          {isAdmin && safeTab === 3 && morePanel}
        </CardContent>
      </Card>
    </div>
  )
}
