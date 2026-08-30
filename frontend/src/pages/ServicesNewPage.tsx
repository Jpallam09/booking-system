import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Loader2Icon } from "lucide-react"

import { createService, type ServicePayload } from "@/api/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { formatCurrency } from "@/lib/format"

const TABS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Pricing" },
  { id: 3, label: "Review" },
] as const

const EMPTY_FORM: ServicePayload = {
  title: "",
  description: "",
  price: "",
  duration_minutes: 30,
  status: "active",
}

export function ServicesNewPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<ServicePayload>(EMPTY_FORM)
  const [createError, setCreateError] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: () => createService(form),
    onSuccess: (created) => {
      toast.add({
        title: "Service created",
        description: `${created.title} added to the catalog.`,
        type: "success",
      })
      navigate(`/services/${created.id}`)
    },
    onError: (err) => {
      const response = (
        err as { response?: { data?: { errors?: Record<string, string[]> } } }
      )?.response?.data
      const messages = response?.errors
      setCreateError(
        messages
          ? Object.values(messages).flat().join(" ")
          : "Failed to create service."
      )
    },
  })

  const priceValid = form.price.trim() !== "" && Number(form.price) > 0
  const durationValid = Number(form.duration_minutes) >= 1
  const canContinue =
    activeTab === 1
      ? form.title.trim() !== "" && form.description.trim() !== ""
      : priceValid && durationValid

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="mb-4 font-heading text-xl font-semibold">New Service</h1>
      <Card>
        <CardContent className="grid gap-5">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 border bg-muted/50 p-1">
              {TABS.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as 1 | 2 | 3)}
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
              <p className="text-sm text-muted-foreground">
                Basic details shown on the services catalog.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                Set the price, length, and availability for this service.
              </p>
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
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
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
                      setForm((f) => ({
                        ...f,
                        duration_minutes: Number(e.target.value),
                      }))
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
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as ServicePayload["status"],
                    }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                Review the service details before creating it.
              </p>
              <div>
                <h2 className="font-heading text-lg font-semibold">
                  {form.title}
                </h2>
                <p className="text-muted-foreground">{form.description}</p>
              </div>
              <div className="grid gap-1 text-sm">
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Price</span>
                  <span>{priceValid ? formatCurrency(form.price) : "—"}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{form.duration_minutes} minutes</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Status</span>
                  <span>{form.status}</span>
                </div>
              </div>
              {createError && (
                <p className="text-xs text-destructive">{createError}</p>
              )}
            </div>
          )}

          <div className="flex justify-between">
            {activeTab === 1 ? (
              <span />
            ) : (
              <Button
                variant="ghost"
                onClick={() => setActiveTab((tab) => (tab - 1) as 1 | 2 | 3)}
                disabled={createMutation.isPending}
              >
                Back
              </Button>
            )}
            {activeTab === 3 ? (
              <Button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2Icon className="size-4 animate-spin" />
                )}
                Create Service
              </Button>
            ) : (
              <Button
                onClick={() => setActiveTab((tab) => (tab + 1) as 1 | 2 | 3)}
                disabled={!canContinue || createMutation.isPending}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
