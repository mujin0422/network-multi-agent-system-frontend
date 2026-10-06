import { ACTIVITIES, DEVICE_ACTIONS, DEVICE_BARS, METRICS, TASK_BARS } from "../data"

export function useDashboardData() {
  return { activities: ACTIVITIES, deviceActions: DEVICE_ACTIONS, deviceBars: DEVICE_BARS, metrics: METRICS, taskBars: TASK_BARS }
}
