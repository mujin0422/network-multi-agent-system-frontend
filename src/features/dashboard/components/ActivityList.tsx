import type { ActivityItem } from "../types/activity-item.type"
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
            className="flex min-w-0 items-center gap-2.5 rounded-lg py-1.5"
          >
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
              <Icon className="size-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-foreground">
                {item.title}
              </p>
              <p className="truncate text-[9px] text-muted-foreground">
                {item.detail}
              </p>
            </div>
            <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
          </div>
        )
      })}
    </div>
  )
}
