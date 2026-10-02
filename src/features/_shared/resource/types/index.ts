export type ResourceStatus = "Active" | "Review" | "Inactive"

export type ResourceRow = {
  name: string
  type: string
  status: ResourceStatus
  updated: string
}

export type ResourceModuleConfig = {
  title: string
  description: string
  action: string
  singular: string
}
