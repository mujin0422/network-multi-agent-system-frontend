import type { ResourceRow } from "../types"

export const DEFAULT_RESOURCE_ROWS: ResourceRow[] = [
  { name: "Primary workspace", type: "Managed", status: "Active", updated: "2 min ago" },
  { name: "Edge network", type: "Automated", status: "Active", updated: "18 min ago" },
  { name: "Core infrastructure", type: "Protected", status: "Review", updated: "1 hour ago" },
  { name: "Development lab", type: "Manual", status: "Inactive", updated: "Yesterday" },
]
