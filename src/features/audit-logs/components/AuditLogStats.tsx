import { Activity, ScrollText, ShieldX, TriangleAlert } from "lucide-react"
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
    denied: number
  }
}) {
  return (
    <PageLayoutOverview>
      <PageLayoutStat
        label="Events"
        value={summary.total}
        description="Recorded audit events"
        icon={<ScrollText />}
      />
      <PageLayoutStat
        label="Successful"
        value={summary.successful}
        description="Successful events"
        icon={<Activity />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="Failed"
        value={summary.failed}
        description="Failed events"
        icon={<TriangleAlert />}
        iconClassName="bg-red-500/10 text-red-400"
      />
      <PageLayoutStat
        label="Denied"
        value={summary.denied}
        description="Rejected actions"
        icon={<ShieldX />}
        iconClassName="bg-amber-500/10 text-amber-400"
      />
    </PageLayoutOverview>
  )
}
