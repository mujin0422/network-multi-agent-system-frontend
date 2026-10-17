import { ChevronDown, RefreshCw } from "lucide-react"
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
import { DASHBOARD_COPY } from "../constants/dashboard.constants"
import { useDashboardData } from "../hooks/use-dashboard-data"
import { ActivityList } from "./ActivityList"
import { BarChart } from "./BarChart"
import { StatusBadge } from "./StatusBadge"

/** Màn hình tổng quan hệ thống với KPI, biểu đồ và hoạt động gần đây. */
export function DashboardOverview() {
  const { activities, deviceActions, deviceBars, metrics, taskBars } =
    useDashboardData()
  return (
    <PageLayout>
      <PageLayoutHeader
        title={DASHBOARD_COPY.title}
        description={DASHBOARD_COPY.description}
      >
        <Button
          variant="outline"
          className="bg-card text-[11px]"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="size-3.5" />
          Refresh
        </Button>
      </PageLayoutHeader>
      <PageLayoutOverview className="grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <PageLayoutStat
              key={metric.label}
              label={metric.label}
              value={metric.value}
              description={metric.change}
              icon={<Icon />}
              className="min-h-[88px] rounded-[10px] border-0 bg-card ring-1 ring-border"
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
      <PageLayoutContent className="space-y-3">
        <section className="grid gap-3 xl:grid-cols-2">
          <Card className="gap-0 rounded-[10px] border-0 bg-card py-3.5 ring-1 ring-border">
            <CardHeader className="grid grid-cols-[1fr_auto] px-3.5">
              <div>
                <CardTitle className="text-[13px] text-foreground">
                  Task Status Overview
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  Tasks completed during the last 7 days
                </p>
              </div>
              <StatusBadge tone="success">96.4% SUCCESS</StatusBadge>
            </CardHeader>
            <CardContent className="mt-4 px-3.5">
              <BarChart bars={taskBars} color="green" />
            </CardContent>
          </Card>
          <Card className="gap-0 rounded-[10px] border-0 bg-card py-3.5 ring-1 ring-border">
            <CardHeader className="grid grid-cols-[1fr_auto] px-3.5">
              <div>
                <CardTitle className="text-[13px] text-foreground">
                  Device Activity Overview
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  Successful command executions by device
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-[10px] text-muted-foreground"
              >
                Last 7 days
                <ChevronDown className="size-3" />
              </Button>
            </CardHeader>
            <CardContent className="mt-4 px-3.5">
              <BarChart bars={deviceBars} color="blue" />
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-3 xl:grid-cols-2">
          <Card className="min-h-[310px] gap-1 rounded-[10px] border-0 bg-card py-3.5 ring-1 ring-border">
            <CardHeader className="grid grid-cols-[1fr_auto] px-3.5">
              <div>
                <CardTitle className="text-[13px] text-foreground">
                  Recent Activities
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  Latest automation events
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-[10px]"
              >
                View all
              </Button>
            </CardHeader>
            <CardContent className="px-3.5">
              <ActivityList items={activities} />
            </CardContent>
          </Card>
          <Card className="min-h-[310px] gap-1 rounded-[10px] border-0 bg-card py-3.5 ring-1 ring-border">
            <CardHeader className="grid grid-cols-[1fr_auto] px-3.5">
              <div>
                <CardTitle className="text-[13px] text-foreground">
                  Recent Device Actions
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  Commands sent to managed devices
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-[10px]"
              >
                Audit logs
              </Button>
            </CardHeader>
            <CardContent className="px-3.5">
              <ActivityList items={deviceActions} />
            </CardContent>
          </Card>
        </section>
      </PageLayoutContent>
    </PageLayout>
  )
}
