import { useState } from "react"
import type { FormMode } from "@/types/components"
import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
} from "@/components/shared/DataTable"
import { MoreMenu } from "@/components/shared/MoreMenu"
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import { useDevicesData } from "../hooks/use-devices-data"
import type { Device } from "../types/device.type"
import { DeviceForm } from "./DeviceForm"
import { DeviceStats } from "./DeviceStats"

/** Màn hình quản lý, lọc và theo dõi trạng thái các thiết bị mạng. */
export function DevicesTable() {
  const {
    rows,
    brands,
    categories,
    summary,
    brandName,
    categoryName,
    auditUserName,
  } = useDevicesData()
  const brandFilterOptions = brands.map((item) => ({
    value: item.id,
    label: item.name,
  }))
  const categoryFilterOptions = categories.map((item) => ({
    value: item.id,
    label: item.name,
  }))
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    device: Device | null
  }>({ open: false, mode: "create", device: null })
  const openForm = (mode: FormMode, device: Device | null = null) =>
    setForm({ open: true, mode, device })
  const headerAction = (
    <Button size="sm" onClick={() => openForm("create")}>
      Add device
    </Button>
  )
  const auditTimestamp = (timestamp: string) =>
    new Date(timestamp).toLocaleString("vi-VN")

  return (
    <>
      <PageLayout>
        <PageLayoutHeader
          title="Devices"
          description="Inventory and live connectivity for every managed network device."
        >
          {headerAction}
        </PageLayoutHeader>
        <DeviceStats summary={summary} />
        <PageLayoutContent>
          <DataTable
            data={rows}
            getRowId={(device) => device.id}
            filters={[
              {
                id: "brand",
                label: "brand",
                accessorKey: "brand_id",
                allLabel: "All brands",
                options: brandFilterOptions,
                searchable: true,
                searchPlaceholder: "Search brands...",
              },
              {
                id: "category",
                label: "category",
                accessorKey: "category_id",
                allLabel: "All categories",
                options: categoryFilterOptions,
                searchable: true,
                searchPlaceholder: "Search categories...",
              },
            ]}
            searchValue={(device) =>
              `${device.hostname} ${device.host} ${device.location} ${device.device_type} ${brandName(device.brand_id)} ${categoryName(device.category_id)}`
            }
            columns={[
              {
                id: "device",
                header: "Device",
                cell: (device) => (
                  <div>
                    <p className="text-xs font-medium">{device.hostname}</p>
                    <p className="font-mono type-caption text-success">
                      {device.id}
                    </p>
                  </div>
                ),
              },
              {
                id: "ip",
                header: "Management IP",
                cell: (device) => (
                  <>
                    <p className="font-mono text-xs">
                      {device.host}:{device.port}
                    </p>
                    <p className="mt-1 type-caption text-muted-foreground">
                      {device.credential_id ?? "No credential"}
                    </p>
                  </>
                ),
              },
              {
                id: "platform",
                header: "Platform",
                cell: (device) => (
                  <>
                    <p className="text-xs">{brandName(device.brand_id)}</p>
                    <p className="mt-1 type-caption text-muted-foreground">
                      {categoryName(device.category_id)} · {device.device_type}
                    </p>
                  </>
                ),
              },
              {
                id: "location",
                header: "Location",
                accessorKey: "location",
                className: "text-xs text-muted-foreground",
              },
              {
                id: "timestamp",
                header: "Timestamp",
                className: "min-w-72 text-muted-foreground",
                cell: (device) => (
                  <div className="type-micro space-y-1 whitespace-nowrap">
                    <p>
                      <span className="font-medium text-foreground">
                        Created by:
                      </span>{" "}
                      {auditUserName(device.created_by)} ·{" "}
                      {auditTimestamp(device.created_at)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Updated by:
                      </span>{" "}
                      {auditUserName(device.last_updated_by)} ·{" "}
                      {auditTimestamp(device.last_updated_at)}
                    </p>
                  </div>
                ),
              },
              {
                id: "actions",
                header: null,
                headerClassName: "w-10",
                cell: (device) => (
                  <MoreMenu
                    onView={() => openForm("view", device)}
                    onEdit={() => openForm("edit", device)}
                    onCopy={() => navigator.clipboard?.writeText(device.id)}
                  />
                ),
              },
            ]}
          >
            <DataTablePanel>
              <DataTableToolbar>
                <DataTableSearch placeholder="Search hostname, IP, location..." />
                <DataTableToolbarActions>
                  <DataTableFilters />
                </DataTableToolbarActions>
              </DataTableToolbar>
              <DataTableContent />
              <DataTablePagination itemLabel="devices" />
            </DataTablePanel>
          </DataTable>
        </PageLayoutContent>
      </PageLayout>
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
