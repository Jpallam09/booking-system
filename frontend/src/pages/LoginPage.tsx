import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { AuthLayout } from "@/components/shared/AuthLayout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FieldErrors = {
  email?: string
  password?: string
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validateField = (field: keyof FieldErrors, value: string) => {
    const next: FieldErrors = { ...fieldErrors }
    if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      next.email = "Enter a valid email address."
      return next
    }
    if (field === "password" && value && value.length < 8) {
      next.password = "Password must be at least 8 characters."
      return next
    }
    delete next[field]
    return next
  }

  const handleBlur =
    (field: keyof FieldErrors) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFieldErrors(validateField(field, e.target.value))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: FieldErrors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address."
    if (!password) next.password = "Enter your password."
    if (Object.keys(next).length > 0) {
      setFieldErrors(next)
      return
    }
    setLoading(true)
    setError(null)
    try {
      await login({ email, password })
      navigate(redirect, { replace: true })
    } catch (err) {
      const response = (
        err as { response?: { data?: { errors?: Record<string, string[]> } } }
      )?.response?.data
      const messages = response?.errors
      setError(
        messages
          ? Object.values(messages).flat().join(" ")
          : "Login failed. Check your credentials."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="grid gap-2">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false} render={<Link to="/" />}
          className="justify-self-start"
        >
          Back
        </Button>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access your appointments and services.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="grid gap-4">
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur("email")}
                    aria-invalid={!!fieldErrors.email || undefined}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                    required
                  />
                  {fieldErrors.email && (
                    <FieldError id="email-error">{fieldErrors.email}</FieldError>
                  )}
                </FieldContent>
              </Field>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={handleBlur("password")}
                      aria-invalid={!!fieldErrors.password || undefined}
                      aria-describedby={
                        fieldErrors.password ? "password-error" : undefined
                      }
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {fieldErrors.password && (
                    <FieldError id="password-error">
                      {fieldErrors.password}
                    </FieldError>
                  )}
                </FieldContent>
              </Field>
              {error && (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                  className="text-primary underline underline-offset-4"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthLayout>
  )
}
