import { Plus, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RESOURCE_STATS } from "../constants"
import type { ResourceModuleConfig, ResourceRow } from "../types"

type ResourcePageProps = {
  config: ResourceModuleConfig
  query: string
  rows: ResourceRow[]
  onQueryChange: (value: string) => void
}

export function ResourcePage({ config, query, rows, onQueryChange }: ResourcePageProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-[22px] font-semibold tracking-tight text-white">{config.title}</h1><p className="mt-1 text-[11px] text-muted-foreground">{config.description}</p></div>
        <Button className="self-start text-xs"><Plus />{config.action}</Button>
      </div>
      <section className="grid gap-3 sm:grid-cols-3">
        {RESOURCE_STATS.map((stat) => <Card key={stat.label} className="gap-1 border-0 bg-card py-4 ring-1 ring-border"><CardContent className="px-4"><p className="text-[10px] text-muted-foreground">{stat.label}</p><p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p></CardContent></Card>)}
      </section>
      <Card className="gap-0 border-0 bg-card py-0 ring-1 ring-border">
        <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => onQueryChange(event.target.value)} className="h-8 bg-background pl-8 text-xs" placeholder={`Search ${config.title.toLowerCase()}...`} /></div>
          <Button variant="outline" size="sm" className="self-start text-xs text-muted-foreground"><SlidersHorizontal />Filter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[11px]">
            <thead className="border-b text-[9px] uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Last updated</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr></thead>
            <tbody>{rows.map((row, index) => <tr key={`${row.name}-${index}`} className="border-b last:border-0 hover:bg-muted/30"><td className="px-4 py-3 font-medium text-[#e9edf3]">{index === 0 ? `${config.title} ${config.singular}` : row.name}</td><td className="px-4 py-3 text-muted-foreground">{row.type}</td><td className="px-4 py-3"><span className={row.status === "Active" ? "text-emerald-400" : row.status === "Review" ? "text-amber-300" : "text-muted-foreground"}>● {row.status}</span></td><td className="px-4 py-3 text-muted-foreground">{row.updated}</td><td className="px-4 py-3 text-right"><Button variant="ghost" size="xs">Manage</Button></td></tr>)}</tbody>
          </table>
          {rows.length === 0 && <p className="px-4 py-10 text-center text-xs text-muted-foreground">No matching results.</p>}
        </div>
      </Card>
    </div>
  )
}
