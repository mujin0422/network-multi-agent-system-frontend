import { CheckCircle2, ListChecks, Play, ShieldAlert } from "lucide-react"
import {
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout"

export function TaskStats({
  summary,
}: {
  summary: {
    total: number
    inProgress: number
    completed: number
    needsAttention: number
  }
}) {
  return (
    <PageLayoutOverview>
      <PageLayoutStat
        label="Total tasks"
        value={summary.total}
        description="Mock task records"
        icon={<ListChecks />}
      />
      <PageLayoutStat
        label="In progress"
        value={summary.inProgress}
        description="Running and planning"
        icon={<Play />}
      />
      <PageLayoutStat
        label="Completed"
        value={summary.completed}
        description="Successful tasks"
        icon={<CheckCircle2 />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="Needs attention"
        value={summary.needsAttention}
        description="Partial, failed, or rejected"
        icon={<ShieldAlert />}
        iconClassName="bg-amber-500/10 text-amber-400"
      />
    </PageLayoutOverview>
  )
}
