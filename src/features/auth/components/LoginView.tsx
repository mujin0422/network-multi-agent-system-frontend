import { Network, ShieldCheck } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LOGIN_COPY } from "../constants/auth.constants"
import { LoginForm } from "./LoginForm"

/** Bố cục trang đăng nhập của hệ thống. */
export function LoginView() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--success),transparent_28%),radial-gradient(circle_at_bottom_right,var(--ring),transparent_25%)] opacity-10" />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Network className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">{LOGIN_COPY.productName}</p>
            <p className="type-caption text-muted-foreground">
              {LOGIN_COPY.productDescription}
            </p>
          </div>
        </div>

        <Card className="shadow-xl shadow-foreground/5">
          <CardHeader className="px-6 pt-2 text-center">
            <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-success/10 text-success">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle className="text-xl">{LOGIN_COPY.title}</CardTitle>
            <CardDescription>{LOGIN_COPY.description}</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-5 text-center type-caption text-muted-foreground">
          {LOGIN_COPY.footer}
        </p>
      </div>
    </main>
  )
}
