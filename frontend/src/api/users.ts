import api from "@/api/client"
import type { Paginated, User, UserRole } from "@/lib/types"

interface ListEnvelope {
  success: boolean
  data: Paginated<User>
}

export interface ListUsersFilters {
  role?: UserRole
  search?: string
  per_page?: string
}

export async function listUsers(
  filters: ListUsersFilters = {}
): Promise<User[]> {
  const { data } = await api.get<ListEnvelope>("/users", { params: filters })
  return data.data.data
}
