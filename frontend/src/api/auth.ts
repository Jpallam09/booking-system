import api from "@/api/client"
import type { LoginPayload, RegisterPayload, User } from "@/lib/types"

interface AuthData {
  message: string
  data: User
  token: string
}

export async function login(payload: LoginPayload): Promise<AuthData> {
  const { data } = await api.post<AuthData>("/login", payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<AuthData> {
  const { data } = await api.post<AuthData>("/register", payload)
  return data
}

export async function logout(): Promise<void> {
  await api.post("/logout")
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/user")
  return data
}
