import { PageLoadingSkeleton } from "@/components/shared/PageLoadingSkeleton"
import { ChevronDown, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout"
import { cn } from "@/lib/utils"
import {
  DASHBOARD_COPY,
  DASHBOARD_STATUS_LABELS,
} from "../constants/dashboard.constants"
import { useDashboardData } from "../hooks/use-dashboard-data"
import { ActivityList } from "./ActivityList"
import { BarChart } from "./BarChart"
import { StatusBadge } from "./StatusBadge"
import { TaskAnalyticsCharts } from "./TaskAnalyticsCharts"

/** Màn hình tổng quan hệ thống với KPI, biểu đồ và hoạt động gần đây. */
export function DashboardOverview() {
  const navigate = useNavigate()
  const {
    activities, deviceActions, deviceBars, metrics, taskBars,
    taskOutcomes, executionTimes, successRate, loading, error, reload,
  } = useDashboardData()
  if (loading) {
    return (
      <PageLoadingSkeleton
        title={DASHBOARD_COPY.title}
        description={DASHBOARD_COPY.description}
        stats={5}
        variant="dashboard"
      />
    )
  }

  return (
    <PageLayout>
      <PageLayoutHeader
        title={DASHBOARD_COPY.title}
        description={DASHBOARD_COPY.description}
      >
        <Button
          variant="outline"
          className="bg-card type-caption"
          disabled={loading}
          onClick={() => void reload()}
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </PageLayoutHeader>
      <PageLayoutOverview className="grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <PageLayoutStat
              key={metric.label}
              label={metric.label}
              value={metric.value}
              description={metric.change}
              icon={<Icon />}
              className="min-h-22 rounded-xl border-0 bg-card ring-1 ring-border"
              iconClassName={cn(
                metric.tone === "success" &&
                  "bg-emerald-500/10 text-emerald-400",
                metric.tone === "running" && "bg-blue-500/10 text-blue-400",
                metric.tone === "waiting" && "bg-amber-500/10 text-amber-400",
                metric.tone === "danger" && "bg-red-500/10 text-red-400",
              )}
            />
          )
        })}
      </PageLayoutOverview>
      <PageLayoutContent className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}
        <section className="grid gap-4 xl:grid-cols-2">
          <Card className="gap-0 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
            <CardHeader className="grid grid-cols-[1fr_auto] px-4">
              <div>
                <CardTitle className="type-caption text-foreground">
                  Task Status Overview
                </CardTitle>
                <p className="type-caption text-muted-foreground">
                  Tasks completed during the last 7 days
                </p>
              </div>
              <StatusBadge tone="success">
                {`${successRate}% ${DASHBOARD_STATUS_LABELS.SUCCESS}`}
              </StatusBadge>
            </CardHeader>
            <CardContent className="mt-4 px-4">
              <BarChart
                bars={taskBars}
                color="green"
                orientation="horizontal"
                valueLabel="tasks"
              />
            </CardContent>
          </Card>
          <Card className="gap-0 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
            <CardHeader className="grid grid-cols-[1fr_auto] px-4">
              <div>
                <CardTitle className="type-caption text-foreground">
                  Device Inventory by Brand
                </CardTitle>
                <p className="type-caption text-muted-foreground">
                  Managed devices grouped by vendor
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent type-caption text-muted-foreground"
              >
                Current
                <ChevronDown className="size-3" />
              </Button>
            </CardHeader>
            <CardContent className="mt-4 px-4">
              <BarChart bars={deviceBars} color="blue" valueLabel="devices" />
            </CardContent>
          </Card>
        </section>
        <TaskAnalyticsCharts
          outcomes={taskOutcomes}
          executionTimes={executionTimes}
        />
        <section className="grid gap-4 xl:grid-cols-2">
          <Card className="min-h-78 gap-1 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
            <CardHeader className="grid grid-cols-[1fr_auto] px-4">
              <div>
                <CardTitle className="type-caption text-foreground">
                  Recent Activities
                </CardTitle>
                <p className="type-caption text-muted-foreground">
                  Latest automation events
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent type-caption"
                onClick={() => navigate("/tasks")}
              >
                View all
              </Button>
            </CardHeader>
            <CardContent className="px-4">
              <ActivityList items={activities} />
            </CardContent>
          </Card>
          <Card className="min-h-78 gap-1 rounded-xl border-0 bg-card py-4 ring-1 ring-border">
            <CardHeader className="grid grid-cols-[1fr_auto] px-4">
              <div>
                <CardTitle className="type-caption text-foreground">
                  Recent Operations
                </CardTitle>
                <p className="type-caption text-muted-foreground">
                  Latest operations from automation tasks
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent type-caption"
                onClick={() => navigate("/tasks")}
              >
                Tasks
              </Button>
            </CardHeader>
            <CardContent className="px-4">
              <ActivityList items={deviceActions} />
            </CardContent>
          </Card>
        </section>
      </PageLayoutContent>
    </PageLayout>
  )
}
