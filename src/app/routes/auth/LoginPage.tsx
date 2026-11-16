import { Navigate } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { LOGIN_COPY, POST_LOGIN_PATH } from "@/features/auth/constants/auth.constants"
import { hasAuthenticatedSession } from "@/features/auth/utils/auth.util"

export default function LoginPage() {
  if (hasAuthenticatedSession()) {
    return <Navigate to={POST_LOGIN_PATH} replace />
  }

  return (
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
  )
}
