import { useState } from "react"
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { LogOut, Menu } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/types"

interface NavItem {
  label: string
  to: string
  roles?: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    roles: ["patient", "dentist", "admin"],
  },
  {
    label: "Appointments",
    to: "/appointments",
    roles: ["patient", "dentist", "admin"],
  },
  { label: "Services", to: "/services", roles: ["patient", "admin"] },
]

function getInitials(name?: string) {
  return (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  )

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="shrink-0 font-heading text-sm font-semibold">
            Lumina Dental
          </Link>
          {visibleItems.length > 0 && (
            <nav className="hidden items-center gap-1 md:flex">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex h-8 items-center px-3 text-xs font-medium transition-colors hover:bg-muted",
                      isActive && "bg-muted text-foreground"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-1.5">
            {visibleItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      aria-label="Open navigation menu"
                    >
                      <Menu />
                    </Button>
                  }
                />
                <DropdownMenuContent className="w-44" align="end">
                  {visibleItems.map((item) => (
                    <DropdownMenuItem
                      key={item.to}
                      render={(props) => (
                        <NavLink
                          {...props}
                          to={item.to}
                          className={({ isActive }) =>
                            cn(
                              props.className,
                              isActive && "bg-accent text-accent-foreground"
                            )
                          }
                        />
                      )}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-1.5 aria-expanded:bg-muted"
                    aria-label="Account menu"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {getInitials(user?.name)}
                    </span>
                    <span className="hidden max-w-32 truncate text-xs font-medium text-foreground md:inline">
                      {user?.name}
                    </span>
                  </Button>
                }
              />
              <DropdownMenuContent className="w-52" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    {user?.name}
                    <div className="text-xs font-normal capitalize text-muted-foreground">
                      {user?.role}
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setLogoutOpen(true)}
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out?"
        description="You will need to sign in again to manage appointments."
        confirmLabel="Logout"
        pending={loggingOut}
        onConfirm={handleLogout}
      />
    </div>
  )
}