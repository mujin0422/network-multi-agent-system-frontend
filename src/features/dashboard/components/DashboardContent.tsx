import { ChevronDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DASHBOARD_COPY } from "../constants"
import { useDashboardData } from "../hooks/use-dashboard-data"
import { ActivityList } from "./ActivityList"
import { BarChart } from "./BarChart"
import { StatusBadge } from "./StatusBadge"

/** Màn hình tổng quan hệ thống với KPI, biểu đồ và hoạt động gần đây. */
export function DashboardContent() {
  const { activities, deviceActions, deviceBars, metrics, taskBars } = useDashboardData()
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">{DASHBOARD_COPY.title}</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{DASHBOARD_COPY.description}</p>
        </div>
        <Button variant="outline" className="bg-card text-[11px]" onClick={() => window.location.reload()}>
          <RefreshCw className="size-3.5" />
          Refresh
        </Button>
      </div>
      <section className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="min-h-[88px] gap-0 rounded-[10px] border-0 bg-card py-3 ring-1 ring-border">
              <CardHeader className="grid grid-cols-[1fr_auto] px-3">
                <p className="text-[10px] text-muted-foreground">{metric.label}</p>
                <Icon className={cn("size-3.5", metric.tone === "success" && "text-emerald-400", metric.tone === "running" && "text-blue-400", metric.tone === "waiting" && "text-amber-400", metric.tone === "danger" && "text-red-400")} />
              </CardHeader>
              <CardContent className="mt-1 flex items-end justify-between px-3">
                <p className="text-[21px] font-semibold leading-none text-foreground">{metric.value}</p>
                <p className={cn("text-[9px]", metric.tone === "success" && "text-emerald-400", metric.tone === "running" && "text-blue-400", metric.tone === "waiting" && "text-amber-400", metric.tone === "danger" && "text-red-400")}>{metric.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>
      <section className="grid gap-3 xl:grid-cols-2">
        <Card className="gap-0 rounded-[10px] border-0 bg-card py-3.5 ring-1 ring-border">
          <CardHeader className="grid grid-cols-[1fr_auto] px-3.5">
            <div>
              <CardTitle className="text-[13px] text-foreground">Task Status Overview</CardTitle>
              <p className="text-[10px] text-muted-foreground">Tasks completed during the last 7 days</p>
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
              <CardTitle className="text-[13px] text-foreground">Device Activity Overview</CardTitle>
              <p className="text-[10px] text-muted-foreground">Successful command executions by device</p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent text-[10px] text-muted-foreground">
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
              <CardTitle className="text-[13px] text-foreground">Recent Activities</CardTitle>
              <p className="text-[10px] text-muted-foreground">Latest automation events</p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent text-[10px]">
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
              <CardTitle className="text-[13px] text-foreground">Recent Device Actions</CardTitle>
              <p className="text-[10px] text-muted-foreground">Commands sent to managed devices</p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent text-[10px]">
              Audit logs
            </Button>
          </CardHeader>
          <CardContent className="px-3.5">
            <ActivityList items={deviceActions} />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
