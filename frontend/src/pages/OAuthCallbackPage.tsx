import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { AlertCircle, Loader2 } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { AuthLayout } from "@/components/shared/AuthLayout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { User } from "@/lib/types"

export function OAuthCallbackPage() {
  const { handleOAuthLogin, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return

    const token = searchParams.get("token")
    const userParam = searchParams.get("user")
    const errorParam = searchParams.get("error")

    if (errorParam) {
      setError(errorParam)
      return
    }

    if (!token || !userParam) {
      setError("Invalid OAuth response. Please try signing in again.")
      return
    }

    handledRef.current = true

    try {
      const user = JSON.parse(decodeURIComponent(userParam)) as User
      handleOAuthLogin(token, user)
      navigate("/dashboard", { replace: true })
    } catch {
      setError("Could not process your Google sign-in. Please try again.")
      handledRef.current = false
    }
  }, [handleOAuthLogin, navigate, searchParams])

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="gap-3">
          <CardTitle>Google Sign-In</CardTitle>
          <CardDescription>
            {error
              ? "There was a problem signing you in."
              : "Finishing your sign-in…"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {!error ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-none border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {error && (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link to="/login" />}
              className="w-full"
            >
              Back to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
