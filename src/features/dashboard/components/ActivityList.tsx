import type { ActivityItem } from "../types/activity-item.type"
import { DASHBOARD_STATUS_LABELS } from "../constants/dashboard.constants"
import { StatusBadge } from "./StatusBadge"

/** Danh sách hoạt động gần đây cùng thời gian và trạng thái xử lý. */
export function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={`${item.title}-${item.detail}`}
            className="flex min-w-0 items-center gap-3 rounded-lg py-2"
          >
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate type-caption font-medium text-foreground">
                {item.title}
              </p>
              <p className="truncate type-caption text-muted-foreground">
                {item.detail}
              </p>
            </div>
            <StatusBadge tone={item.tone}>
              {DASHBOARD_STATUS_LABELS[item.status]}
            </StatusBadge>
          </div>
        )
      })}
    </div>
  )
}
