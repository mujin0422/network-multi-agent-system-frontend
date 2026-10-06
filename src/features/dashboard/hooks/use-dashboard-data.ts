import { ACTIVITIES, DEVICE_ACTIONS, DEVICE_BARS, METRICS, TASK_BARS } from "../data"

// Cung cấp dữ liệu tổng quan cần thiết cho màn hình dashboard.
export function useDashboardData() {
  return { activities: ACTIVITIES, deviceActions: DEVICE_ACTIONS, deviceBars: DEVICE_BARS, metrics: METRICS, taskBars: TASK_BARS }
}
