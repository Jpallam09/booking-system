export type UserRole = "patient" | "dentist" | "admin"

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Service {
  id: number
  title: string
  description: string
  price: string
  duration_minutes: number
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export type AppointmentStatus =
  "pending" | "confirmed" | "completed" | "cancelled"

export interface Appointment {
  id: number
  patient_id: number
  dentist_id: number | null
  service_id: number
  appointment_date: string
  status: AppointmentStatus
  dental_concern: string | null
  treatment_notes: string | null
  cancellation_reason: string | null
  cancelled_by: string | null
  created_at: string
  updated_at: string
  patient?: User
  dentist?: User | null
  service?: Service
}

export interface Paginated<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{ url: string | null; label: string; active: boolean }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export interface ServiceFilters {
  search?: string
  status?: "active" | "inactive"
  min_price?: string
  max_price?: string
  page?: number
  per_page?: string
}

export interface AppointmentFilters {
  search?: string
  status?: AppointmentStatus
  service_id?: string
  from?: string
  to?: string
  page?: number
  per_page?: string
}
