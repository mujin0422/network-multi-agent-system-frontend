import { Cpu, Network, Router, Server } from "lucide-react"
import {
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout"

export function DeviceStats({
  summary,
}: {
  summary: {
    total: number
    routers: number
    switches: number
    deviceTypes: number
  }
}) {
  return (
    <PageLayoutOverview>
      <PageLayoutStat
        label="Total devices"
        value={summary.total}
        description="Inventory endpoints"
        icon={<Server />}
      />
      <PageLayoutStat
        label="Routers"
        value={summary.routers}
        description="Router category"
        icon={<Router />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="Switches"
        value={summary.switches}
        description="Switch category"
        icon={<Network />}
        iconClassName="bg-amber-500/10 text-amber-400"
      />
      <PageLayoutStat
        label="Device types"
        value={summary.deviceTypes}
        description="Unique Netmiko drivers"
        icon={<Cpu />}
        iconClassName="bg-violet-500/10 text-violet-400"
      />
    </PageLayoutOverview>
  )
}
