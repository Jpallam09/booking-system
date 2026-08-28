import { describe, expect, it, beforeEach } from "vitest"

import {
  clearAuth,
  clearBookingDraft,
  getBookingDraft,
  getToken,
  getUser,
  setAuth,
  setBookingDraft,
} from "@/lib/auth"
import type { User } from "@/lib/types"

const user: User = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  phone: null,
  role: "patient",
  created_at: "2026-01-01T00:00:00.000000Z",
  updated_at: "2026-01-01T00:00:00.000000Z",
}

describe("auth storage helpers", () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it("returns null token/user when nothing is stored", () => {
    expect(getToken()).toBeNull()
    expect(getUser()).toBeNull()
  })

  it("stores and retrieves the auth token and user", () => {
    setAuth("abc123", user)
    expect(getToken()).toBe("abc123")
    expect(getUser()).toEqual(user)
  })

  it("clears token and user on clearAuth", () => {
    setAuth("abc123", user)
    clearAuth()
    expect(getToken()).toBeNull()
    expect(getUser()).toBeNull()
  })

  it("returns null user for malformed JSON", () => {
    localStorage.setItem("auth_user", "{not-json")
    expect(getUser()).toBeNull()
  })
})

describe("booking draft storage helpers", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("stores and retrieves a booking draft", () => {
    const draft = {
      service_id: "3",
      appointment_date: "2026-09-01T10:00",
      dental_concern: "Toothache",
    }
    setBookingDraft(draft)
    expect(getBookingDraft()).toEqual(draft)
  })

  it("returns null when no draft exists", () => {
    expect(getBookingDraft()).toBeNull()
  })

  it("clears the draft", () => {
    setBookingDraft({
      service_id: "3",
      appointment_date: "2026-09-01T10:00",
      dental_concern: "",
    })
    clearBookingDraft()
    expect(getBookingDraft()).toBeNull()
  })
})
