import { KeyRound, Link2, ShieldCheck, Unplug } from "lucide-react"
import {
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout"

export function CredentialStats({
  summary,
}: {
  summary: {
    total: number
    assigned: number
    deviceAssignments: number
    unassigned: number
  }
}) {
  return (
    <PageLayoutOverview>
      <PageLayoutStat
        label="Credential sets"
        value={summary.total}
        description="Encrypted profiles"
        icon={<KeyRound />}
      />
      <PageLayoutStat
        label="Assigned profiles"
        value={summary.assigned}
        description="Used by devices"
        icon={<ShieldCheck />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="Assignments"
        value={summary.deviceAssignments}
        description="Credential-device links"
        icon={<Link2 />}
        iconClassName="bg-violet-500/10 text-violet-400"
      />
      <PageLayoutStat
        label="Unassigned"
        value={summary.unassigned}
        description="Available profiles"
        icon={<Unplug />}
        iconClassName="bg-amber-500/10 text-amber-400"
      />
    </PageLayoutOverview>
  )
}
