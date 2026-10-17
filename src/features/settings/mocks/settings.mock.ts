import type { ResourceRow } from "../types/resource-row.type"

export const MOCK_ROWS: ResourceRow[] = [
  { name: "System Settings setting", type: "Managed", status: "Active", updated: "2 min ago" },
  { name: "Locale defaults", type: "Managed", status: "Active", updated: "18 min ago" },
  { name: "Notification policy", type: "Protected", status: "Review", updated: "1 hour ago" },
  { name: "Development overrides", type: "Manual", status: "Inactive", updated: "Yesterday" },
]
