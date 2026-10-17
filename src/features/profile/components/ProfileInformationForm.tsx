import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  KeyRound,
  Mail,
} from "lucide-react"
import type { FormEvent, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProfileSession } from "../types/profile-session.type"
import type { ProfileUser } from "../types/profile-user.type"

export function ProfileInformationForm({
  profile,
  roleName,
  session,
  fullName,
  email,
  editing,
  onFullNameChange,
  onEmailChange,
  onSubmit,
}: {
  profile: ProfileUser
  roleName: string
  session: ProfileSession
  fullName: string
  email: string
  editing: boolean
  onFullNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form id="profile-form" onSubmit={onSubmit} className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Personal information</CardTitle>
          <p className="text-xs text-muted-foreground">
            Information used to identify your account across the platform.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
              disabled={!editing}
              required
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                disabled={!editing}
                required
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Account status</Label>
            <Input value={profile.user_status} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned role</Label>
            <Input value={roleName} disabled />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Account & security</CardTitle>
          <p className="text-xs text-muted-foreground">
            Authentication and session information is protected by the system.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <SecurityItem
            icon={KeyRound}
            label="Password"
            value="Protected with bcrypt"
            action={
              <Button type="button" variant="outline" size="xs">
                Change password
              </Button>
            }
          />
          <SecurityItem
            icon={CheckCircle2}
            label="Session"
            value={`Expires ${new Date(session.expires_at).toLocaleString("vi-VN")}`}
          />
          <SecurityItem
            icon={CalendarDays}
            label="Account created"
            value={new Date(profile.created_at).toLocaleString("vi-VN")}
          />
          <SecurityItem
            icon={Clock3}
            label="Last updated"
            value={
              profile.last_updated_at
                ? new Date(profile.last_updated_at).toLocaleString("vi-VN")
                : "Never"
            }
          />
        </CardContent>
      </Card>
    </form>
  )
}

function SecurityItem({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: typeof KeyRound
  label: string
  value: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{label}</p>
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
          {value}
        </p>
      </div>
      {action}
    </div>
  )
}
