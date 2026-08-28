import axios from "axios"

import { getToken, clearAuth } from "@/lib/auth"

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000"

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
      const { pathname } = window.location
      // Never auto-redirect away from the public landing page.
      if (pathname !== "/" && !pathname.startsWith("/login")) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          pathname + window.location.search
        )}`
      }
    }
    return Promise.reject(error)
  }
)

export default api
