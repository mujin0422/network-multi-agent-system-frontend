import { CalendarDays, CheckCircle2, Clock3, KeyRound, Mail, Pencil, Save, ShieldCheck, UserRound, X } from "lucide-react"
import { useState, type FormEvent, type ReactNode } from "react"
import { FeatureHeader, StatusBadge } from "@/components/common/FeatureShell"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PROFILE_COPY } from "../constants"
import { useProfileData } from "../hooks/use-profile-data"

/** Màn hình hồ sơ cá nhân gồm thông tin tài khoản và thiết lập bảo mật. */
export function ProfileContent() {
  const { profile, role, mode, setMode, saveProfile } = useProfileData()
  const [fullName, setFullName] = useState(profile.full_name)
  const [email, setEmail] = useState(profile.email)
  const isEditing = mode === "edit"
  const cancelEdit = () => {
    setFullName(profile.full_name)
    setEmail(profile.email)
    setMode("view")
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveProfile({ full_name: fullName.trim(), email: email.trim() })
  }
  const initials = profile.full_name
    .split(" ")
    .slice(-2)
    .map((part) => part[0])
    .join("")
  const headerAction = isEditing ? (
    <div className="flex gap-2">
      <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
        <X />
        Cancel
      </Button>
      <Button type="submit" size="sm" form="profile-form">
        <Save />
        Save changes
      </Button>
    </div>
  ) : (
    <Button size="sm" onClick={() => setMode("edit")}>
      <Pencil />
      Edit profile
    </Button>
  )
  const passwordAction = (
    <Button type="button" variant="outline" size="xs">
      Change password
    </Button>
  )

  return (
    <div className="space-y-5">
      <FeatureHeader title={PROFILE_COPY.title} description={PROFILE_COPY.description} action={headerAction} />
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card className="self-start">
          <CardContent className="flex flex-col items-center px-6 py-5 text-center">
            <Avatar size="lg" className="size-20">
              <AvatarFallback className="bg-blue-500/10 text-xl font-semibold text-blue-400">{initials}</AvatarFallback>
              <AvatarBadge className="size-4 bg-emerald-400 ring-card" />
            </Avatar>
            <h2 className="mt-4 text-base font-semibold">{profile.full_name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{profile.email}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-300">{role.name}</span>
              <StatusBadge value={profile.status} />
            </div>
            <div className="mt-5 w-full space-y-3 border-t pt-4 text-left">
              <ProfileMeta icon={UserRound} label="User ID" value={profile.id} mono />
              <ProfileMeta icon={ShieldCheck} label="Role ID" value={profile.role_id} mono />
              <ProfileMeta icon={Clock3} label="Last login" value={profile.last_login_at ? new Date(profile.last_login_at).toLocaleString("vi-VN") : "Never"} />
            </div>
          </CardContent>
        </Card>
        <form id="profile-form" onSubmit={submit} className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Personal information</CardTitle>
              <p className="text-xs text-muted-foreground">Information used to identify your account across the platform.</p>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" value={fullName} onChange={(event) => setFullName(event.target.value)} disabled={!isEditing} required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={!isEditing} required className="pl-8" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Account status</Label>
                <Input value={profile.status} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Assigned role</Label>
                <Input value={role.name} disabled />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Account & security</CardTitle>
              <p className="text-xs text-muted-foreground">Authentication and session information is protected by the system.</p>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <SecurityItem icon={KeyRound} label="Password" value="Protected with Argon2id" action={passwordAction} />
              <SecurityItem icon={CheckCircle2} label="Session" value={profile.expires_at ? `Expires ${new Date(profile.expires_at).toLocaleString("vi-VN")}` : "No active session"} />
              <SecurityItem icon={CalendarDays} label="Account created" value={new Date(profile.created_at).toLocaleString("vi-VN")} />
              <SecurityItem icon={Clock3} label="Last updated" value={profile.last_updated_at ? new Date(profile.last_updated_at).toLocaleString("vi-VN") : "Never"} />
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

/** Hiển thị một thuộc tính hồ sơ với icon và kiểu chữ phù hợp. */
function ProfileMeta({ icon: Icon, label, value, mono = false }: { icon: typeof UserRound; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-3.5 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={mono ? "mt-0.5 truncate font-mono text-[10px]" : "mt-0.5 text-[10px]"}>{value}</p>
      </div>
    </div>
  )
}

/** Hàng thông tin bảo mật có thể kèm hành động quản lý. */
function SecurityItem({ icon: Icon, label, value, action }: { icon: typeof KeyRound; label: string; value: string; action?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{label}</p>
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{value}</p>
      </div>
      {action}
    </div>
  )
}
