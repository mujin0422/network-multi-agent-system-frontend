import { ACTIVITIES } from "../mocks/activities.mock"
import { DASHBOARD_METRICS } from "../mocks/dashboard-metrics.mock"
import { DEVICE_ACTIONS } from "../mocks/device-actions.mock"
import { DEVICE_BARS } from "../mocks/device-bars.mock"
import { TASK_BARS } from "../mocks/task-bars.mock"

// Cung cấp dữ liệu tổng quan cần thiết cho màn hình dashboard.
export function useDashboardData() {
  return { activities: ACTIVITIES, deviceActions: DEVICE_ACTIONS, deviceBars: DEVICE_BARS, metrics: DASHBOARD_METRICS, taskBars: TASK_BARS }
}
