import { Cpu, Layers3, Network, Tags } from "lucide-react"
import {
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout"

export function DeviceCatalogStats({
  summary,
}: {
  summary: {
    brands: number
    categories: number
    drivers: number
    assignedDevices: number
  }
}) {
  return (
    <PageLayoutOverview>
      <PageLayoutStat
        label="Brands"
        value={summary.brands}
        description="Supported vendors"
        icon={<Tags />}
      />
      <PageLayoutStat
        label="Categories"
        value={summary.categories}
        description="Inventory classes"
        icon={<Layers3 />}
        iconClassName="bg-violet-500/10 text-violet-400"
      />
      <PageLayoutStat
        label="Drivers"
        value={summary.drivers}
        description="Unique Netmiko drivers"
        icon={<Cpu />}
        iconClassName="bg-emerald-500/10 text-emerald-400"
      />
      <PageLayoutStat
        label="Assigned devices"
        value={summary.assignedDevices}
        description="Across all categories"
        icon={<Network />}
        iconClassName="bg-amber-500/10 text-amber-400"
      />
    </PageLayoutOverview>
  )
}
