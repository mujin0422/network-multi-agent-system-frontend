import { Clock3, ShieldCheck, UserCheck, Users } from "lucide-react"
import {
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout"

export function UserStats({
  summary,
}: {
  summary: {
    total: number
    active: number
    rolesAssigned: number
    loggedIn: number
  }
}) {
  return (
    <PageLayoutOverview>
      <PageLayoutStat
        label="Total users"
        value={summary.total}
        description="Platform identities"
        icon={<Users />}
      />
      <PageLayoutStat
        label="Active"
        value={summary.active}
        description="Enabled accounts"
        icon={<UserCheck />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="Roles assigned"
        value={summary.rolesAssigned}
        description="RBAC coverage"
        icon={<ShieldCheck />}
        iconClassName="bg-violet-500/10 text-violet-400"
      />
      <PageLayoutStat
        label="Logged in"
        value={summary.loggedIn}
        description="Users with login history"
        icon={<Clock3 />}
      />
    </PageLayoutOverview>
  )
}
