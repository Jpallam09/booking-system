import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { register } from "@/api/auth"
import { setAuth } from "@/lib/auth"
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
  name?: string
  email?: string
  phone?: string
  password?: string
  password_confirmation?: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validateField = (field: keyof FieldErrors, value: string) => {
    const next: FieldErrors = { ...fieldErrors }
    if (field === "name" && value && value.trim().length < 2) {
      next.name = "Enter your full name."
      return next
    }
    if (field === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      next.email = "Enter a valid email address."
      return next
    }
    if (field === "phone" && value && !/^[+\d][\d\s().-]*$/.test(value)) {
      next.phone = "Enter a valid phone number."
      return next
    }
    if (field === "password" && value && value.length < 8) {
      next.password = "Password must be at least 8 characters."
      return next
    }
    if (
      field === "password_confirmation" &&
      value &&
      (form.password !== value || !value)
    ) {
      next.password_confirmation = "Passwords do not match."
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
    if (form.password !== form.password_confirmation) {
      next.password_confirmation = "Passwords do not match."
    }
    if (form.name.trim().length < 2) next.name = "Enter your full name."
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address."
    if (form.password.length < 8) next.password = "Password must be at least 8 characters."
    if (Object.keys(next).length > 0) {
      setFieldErrors(next)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, token } = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      })
      setAuth(token, data)
      navigate(redirect, { replace: true })
    } catch (err) {
      const response = (
        err as { response?: { data?: { errors?: Record<string, string[]> } } }
      )?.response?.data
      const messages = response?.errors
      setError(
        messages
          ? Object.values(messages).flat().join(" ")
          : "Registration failed."
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
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Register as a patient.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="grid gap-4">
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={update("name")}
                    onBlur={handleBlur("name")}
                    aria-invalid={!!fieldErrors.name || undefined}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    required
                  />
                  {fieldErrors.name && (
                    <FieldError id="name-error">{fieldErrors.name}</FieldError>
                  )}
                </FieldContent>
              </Field>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={update("email")}
                    onBlur={handleBlur("email")}
                    aria-invalid={!!fieldErrors.email || undefined}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    required
                  />
                  {fieldErrors.email && (
                    <FieldError id="email-error">{fieldErrors.email}</FieldError>
                  )}
                </FieldContent>
              </Field>
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    onBlur={handleBlur("phone")}
                    aria-invalid={!!fieldErrors.phone || undefined}
                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  />
                  {fieldErrors.phone && (
                    <FieldError id="phone-error">{fieldErrors.phone}</FieldError>
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
                      autoComplete="new-password"
                      value={form.password}
                      onChange={update("password")}
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
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor="password_confirmation">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password_confirmation}
                      onChange={update("password_confirmation")}
                      onBlur={handleBlur("password_confirmation")}
                      aria-invalid={!!fieldErrors.password_confirmation || undefined}
                      aria-describedby={
                        fieldErrors.password_confirmation
                          ? "password-confirmation-error"
                          : undefined
                      }
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      {showConfirm ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {fieldErrors.password_confirmation && (
                    <FieldError id="password-confirmation-error">
                      {fieldErrors.password_confirmation}
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
                {loading ? "Creating..." : "Register"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                  className="text-primary underline underline-offset-4"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthLayout>
  )
}
