import api from "@/api/client"
import type { Paginated, Service, ServiceFilters } from "@/lib/types"

interface ListEnvelope {
  success: boolean
  data: Paginated<Service>
}

interface ItemEnvelope {
  success: boolean
  message?: string
  data: Service
}

export interface ServicePayload {
  title: string
  description: string
  price: string
  duration_minutes?: number
  status?: "active" | "inactive"
}

export async function listServices(
  filters: ServiceFilters = {}
): Promise<Paginated<Service>> {
  const { data } = await api.get<ListEnvelope>("/services", {
    params: filters,
  })
  return data.data
}

export async function getService(id: number): Promise<Service> {
  const { data } = await api.get<ItemEnvelope>(`/services/${id}`)
  return data.data
}

export async function createService(payload: ServicePayload): Promise<Service> {
  const { data } = await api.post<ItemEnvelope>("/services", payload)
  return data.data
}

export async function updateService(
  id: number,
  payload: ServicePayload
): Promise<Service> {
  const { data } = await api.put<ItemEnvelope>(`/services/${id}`, payload)
  return data.data
}

export async function deleteService(id: number): Promise<void> {
  await api.delete(`/services/${id}`)
}
