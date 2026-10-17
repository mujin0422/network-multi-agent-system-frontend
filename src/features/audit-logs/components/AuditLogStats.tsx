import { Activity, CircleHelp, Terminal, TriangleAlert } from "lucide-react"
import {
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout"

export function AuditLogStats({
  summary,
}: {
  summary: {
    total: number
    successful: number
    failed: number
    unknown: number
  }
}) {
  return (
    <PageLayoutOverview>
      <PageLayoutStat
        label="Commands"
        value={summary.total}
        description="Mock audit records"
        icon={<Terminal />}
      />
      <PageLayoutStat
        label="Successful"
        value={summary.successful}
        description="Completed commands"
        icon={<Activity />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="Failed"
        value={summary.failed}
        description="Confirmed failures"
        icon={<TriangleAlert />}
        iconClassName="bg-red-500/10 text-red-400"
      />
      <PageLayoutStat
        label="Unknown"
        value={summary.unknown}
        description="Outcome requires review"
        icon={<CircleHelp />}
        iconClassName="bg-amber-500/10 text-amber-400"
      />
    </PageLayoutOverview>
  )
}
