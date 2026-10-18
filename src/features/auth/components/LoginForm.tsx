import { CircleAlert, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LOGIN_COPY } from "../constants/auth.constants"
import { useLogin } from "../hooks/use-login"

/** Form đăng nhập với tài khoản Super Administrator demo được điền sẵn. */
export function LoginForm() {
  const {
    clearError,
    credentials,
    error,
    showPassword,
    togglePassword,
    submit,
  } = useLogin()
  const hasError = error === "invalid-credentials"

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            autoFocus
            defaultValue={credentials.email}
            className="h-10 pl-10"
            aria-invalid={hasError}
            aria-describedby={hasError ? "login-error" : undefined}
            onChange={clearError}
            spellCheck={false}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            defaultValue={credentials.password}
            className="h-10 px-10"
            aria-invalid={hasError}
            aria-describedby={hasError ? "login-error" : undefined}
            onChange={clearError}
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {hasError && (
        <div
          id="login-error"
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs leading-4 text-destructive"
        >
          <CircleAlert className="mt-px size-4 shrink-0" />
          <span>{LOGIN_COPY.invalidCredentials}</span>
        </div>
      )}

      <div className="rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-xs text-success">
        {LOGIN_COPY.demoNotice}
      </div>

      <Button type="submit" className="h-10 w-full">
        {LOGIN_COPY.submitLabel}
      </Button>
    </form>
  )
}
