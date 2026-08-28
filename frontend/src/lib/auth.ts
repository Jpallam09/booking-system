import type { User } from "@/lib/types"

const TOKEN_KEY = "auth_token"
const USER_KEY = "auth_user"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function setAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

const DRAFT_KEY = "booking_draft"

export interface BookingDraft {
  service_id: string
  appointment_date: string
  dental_concern: string
}

export function getBookingDraft(): BookingDraft | null {
  const raw = sessionStorage.getItem(DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as BookingDraft
  } catch {
    return null
  }
}

export function setBookingDraft(draft: BookingDraft): void {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function clearBookingDraft(): void {
  sessionStorage.removeItem(DRAFT_KEY)
}
