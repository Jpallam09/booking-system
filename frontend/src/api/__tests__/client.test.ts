import type { InternalAxiosRequestConfig } from "axios"
import { describe, expect, it, beforeEach } from "vitest"

import api from "@/api/client"

const requestHandlers = api.interceptors.request as unknown as {
  handlers: Array<{
    fulfilled: (
      config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig
  }>
}

function makeConfig(
  headers: Record<string, string> = {}
): InternalAxiosRequestConfig {
  return { headers: { ...headers } } as InternalAxiosRequestConfig
}

describe("axios client", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("defaults baseURL to the API base path", () => {
    expect(String(api.defaults.baseURL)).toContain("/api")
  })

  it("injects the Authorization header when a token exists", () => {
    localStorage.setItem("auth_token", "test-token")
    const result = requestHandlers.handlers[0].fulfilled(makeConfig())
    expect(result.headers.Authorization).toBe("Bearer test-token")
  })

  it("does not set Authorization when no token exists", () => {
    const result = requestHandlers.handlers[0].fulfilled(makeConfig())
    expect(result.headers.Authorization).toBeUndefined()
  })

  it("preserves existing request headers", () => {
    localStorage.setItem("auth_token", "test-token")
    const result = requestHandlers.handlers[0].fulfilled(
      makeConfig({ "X-Custom": "value" })
    )
    expect(result.headers["X-Custom"]).toBe("value")
    expect(result.headers.Authorization).toBe("Bearer test-token")
  })
})
