import api from "@/api/client"
import type { Appointment, AppointmentFilters, Paginated } from "@/lib/types"

interface ListEnvelope {
  success: boolean
  data: Paginated<Appointment>
}

interface ItemEnvelope {
  success: boolean
  message?: string
  data: Appointment
}

export interface CreateAppointmentPayload {
  service_id: number
  appointment_date: string
  dental_concern?: string
}

export interface UpdateAppointmentPayload {
  appointment_date?: string
  dental_concern?: string
}

export async function listAppointments(
  filters: AppointmentFilters = {}
): Promise<Paginated<Appointment>> {
  const { data } = await api.get<ListEnvelope>("/appointments", {
    params: filters,
  })
  return data.data
}

export async function getAppointment(id: number): Promise<Appointment> {
  const { data } = await api.get<ItemEnvelope>(`/appointments/${id}`)
  return data.data
}

export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<Appointment> {
  const { data } = await api.post<ItemEnvelope>("/appointments", payload)
  return data.data
}

export async function updateAppointment(
  id: number,
  payload: UpdateAppointmentPayload
): Promise<Appointment> {
  const { data } = await api.put<ItemEnvelope>(`/appointments/${id}`, payload)
  return data.data
}

export async function deleteAppointment(id: number): Promise<void> {
  await api.delete(`/appointments/${id}`)
}

export async function assignDentist(
  id: number,
  dentistId: number
): Promise<Appointment> {
  const { data } = await api.post<ItemEnvelope>(
    `/appointments/${id}/assign-dentist`,
    { dentist_id: dentistId }
  )
  return data.data
}

export async function confirmAppointment(id: number): Promise<Appointment> {
  const { data } = await api.post<ItemEnvelope>(`/appointments/${id}/confirm`)
  return data.data
}

export async function completeAppointment(id: number): Promise<Appointment> {
  const { data } = await api.post<ItemEnvelope>(`/appointments/${id}/complete`)
  return data.data
}

export async function cancelAppointment(
  id: number,
  cancellation_reason: string
): Promise<Appointment> {
  const { data } = await api.post<ItemEnvelope>(`/appointments/${id}/cancel`, {
    cancellation_reason,
  })
  return data.data
}
