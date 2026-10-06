import {
  Activity,
  CirclePlus,
  Router,
  Server,
  TriangleAlert,
} from "lucide-react"
import { useState } from "react"
import type { FormMode } from "@/components/common/FeatureFormSheet"
import { DataPagination } from "@/components/common/DataPagination"
import {
  FeatureHeader,
  FilterCombobox,
  StatCard,
  TableToolbar,
} from "@/components/common/FeatureShell"
import { MoreMenu } from "@/components/common/MoreMenu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MOCK_BRANDS, MOCK_CATEGORIES } from "../data"
import { useDevicesData } from "../hooks/useDevicesData"
import type { Device } from "../types"
import { DeviceForm } from "./DeviceForm"

/** Màn hình quản lý, lọc và theo dõi trạng thái các thiết bị mạng. */
export function DevicesContent() {
  const {
    query,
    rows,
    pagination,
    brand,
    category,
    setQuery,
    setBrand,
    setCategory,
    brandName,
    categoryName,
  } = useDevicesData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    device: Device | null
  }>({ open: false, mode: "create", device: null })
  const openForm = (mode: FormMode, device: Device | null = null) =>
    setForm({ open: true, mode, device })
  return (
    <>
      <div className="space-y-5">
        <FeatureHeader
          title="Devices"
          description="Inventory and live connectivity for every managed network device."
          action={
            <Button size="sm" onClick={() => openForm("create")}>
              <CirclePlus />
              Add device
            </Button>
          }
        />
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total devices"
            value="5"
            detail="Across 3 locations"
            icon={Server}
          />
          <StatCard
            label="Connected"
            value="2"
            detail="Healthy connections"
            icon={Activity}
            tone="green"
          />
          <StatCard
            label="Needs attention"
            value="2"
            detail="1 missing credential"
            icon={TriangleAlert}
            tone="amber"
          />
          <StatCard
            label="Device types"
            value="3"
            detail="Router, switch, firewall"
            icon={Router}
            tone="violet"
          />
        </section>
        <Card className="gap-0 py-0">
          <TableToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder="Search hostname, IP, location..."
          >
            <FilterCombobox
              value={brand}
              onValueChange={setBrand}
              ariaLabel="Filter by brand"
              options={[
                { value: "ALL", label: "All brands" },
                ...MOCK_BRANDS.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />
            <FilterCombobox
              value={category}
              onValueChange={setCategory}
              ariaLabel="Filter by category"
              options={[
                { value: "ALL", label: "All categories" },
                ...MOCK_CATEGORIES.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />
          </TableToolbar>
          <Table>
            <TableHeader>
              <TableRow className="text-[10px] uppercase tracking-wide text-muted-foreground">
                <TableHead className="pl-4">Device</TableHead>
                <TableHead>Management IP</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Server className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">{device.hostname}</p>
                        <p className="font-mono text-[9px] text-muted-foreground">
                          {device.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-mono text-xs">
                      {device.host}:{device.port}
                    </p>
                    <p className="mt-0.5 text-[9px] text-muted-foreground">
                      {device.credential_id ?? "No credential"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs">{brandName(device.brand_id)}</p>
                    <p className="mt-0.5 text-[9px] text-muted-foreground">
                      {categoryName(device.category_id)} · {device.device_type}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {device.location}
                  </TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">
                    {new Date(device.last_updated_at).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <MoreMenu
                      onView={() => openForm("view", device)}
                      onEdit={() => openForm("edit", device)}
                      onCopy={() => navigator.clipboard?.writeText(device.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataPagination {...pagination} onPageChange={pagination.setPage} />
        </Card>
      </div>
      <DeviceForm
        open={form.open}
        mode={form.mode}
        device={form.device}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
        onModeChange={(mode) => setForm((current) => ({ ...current, mode }))}
      />
    </>
  )
}
