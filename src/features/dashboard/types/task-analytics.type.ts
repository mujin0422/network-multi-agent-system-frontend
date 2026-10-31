export type TaskOutcomePoint = {
  label: string
  success: number
  partial: number
  failed: number
  rejected: number
}

export type ExecutionTimePoint = {
  label: string
  averageSeconds: number
  taskCount: number
}
