import { Clock3, ShieldCheck, UserRound } from "lucide-react"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { ProfileUser } from "../types/profile-user.type"
import { profileInitials } from "../utils/profile.util"

export function ProfileSummaryCard({
  profile,
  roleName,
}: {
  profile: ProfileUser
  roleName: string
}) {
  return (
    <Card className="self-start">
      <CardContent className="flex flex-col items-center px-6 py-5 text-center">
        <Avatar size="lg" className="size-20">
          <AvatarFallback className="bg-blue-500/10 text-xl font-semibold text-blue-400">
            {profileInitials(profile.full_name)}
          </AvatarFallback>
          <AvatarBadge className="size-4 bg-emerald-400 ring-card" />
        </Avatar>
        <h2 className="mt-4 text-base font-semibold">{profile.full_name}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{profile.email}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-md bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-300">
            {roleName}
          </span>
          <StatusBadge value={profile.user_status} />
        </div>
        <div className="mt-5 w-full space-y-3 border-t pt-4 text-left">
          <ProfileMeta
            icon={UserRound}
            label="User ID"
            value={profile.id}
            mono
          />
          <ProfileMeta
            icon={ShieldCheck}
            label="Role ID"
            value={profile.role_id}
            mono
          />
          <ProfileMeta
            icon={Clock3}
            label="Last login"
            value={
              profile.last_login_at
                ? new Date(profile.last_login_at).toLocaleString("vi-VN")
                : "Never"
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileMeta({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: typeof UserRound
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-3.5 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={
            mono
              ? "mt-0.5 truncate font-mono text-[10px]"
              : "mt-0.5 text-[10px]"
          }
        >
          {value}
        </p>
      </div>
    </div>
  )
}
