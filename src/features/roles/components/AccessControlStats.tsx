import { LockKeyhole, ShieldCheck, Users } from "lucide-react"
import {
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout"

export function AccessControlStats({
  roles,
  permissions,
  functions,
}: {
  roles: number
  permissions: number
  functions: number
}) {
  return (
    <PageLayoutOverview className="xl:grid-cols-3">
      <PageLayoutStat
        label="Roles"
        value={roles}
        description="1 system-protected"
        icon={<Users />}
      />
      <PageLayoutStat
        label="Permissions"
        value={permissions}
        description="Function + action pairs"
        icon={<ShieldCheck />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="Functions"
        value={functions}
        description="Protected modules"
        icon={<LockKeyhole />}
        iconClassName="bg-violet-500/10 text-violet-400"
      />
    </PageLayoutOverview>
  )
}
