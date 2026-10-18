import type { ReactNode } from "react"
import {
  DataTable,
  DataTableContent,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
} from "@/components/shared/DataTable"
import { MoreMenu } from "@/components/shared/MoreMenu"
import type { Brand } from "../types/brand.type"

export function BrandTable({
  brands,
  children,
  onView,
  onEdit,
}: {
  brands: Brand[]
  children?: ReactNode
  onView: (brand: Brand) => void
  onEdit: (brand: Brand) => void
}) {
  return (
    <DataTable
      data={brands}
      getRowId={(brand) => brand.id}
      searchValue={(brand) =>
        `${brand.name} ${brand.id} ${brand.supported_drivers.join(" ")}`
      }
      columns={[
        {
          id: "brand",
          header: "Brand",
          headerClassName: "pl-4",
          className: "pl-4",
          cell: (brand) => (
            <>
              <p className="text-xs font-medium">{brand.name}</p>
              <p className="mt-1 font-mono type-caption text-muted-foreground">
                {brand.id}
              </p>
            </>
          ),
        },
        {
          id: "drivers",
          header: "Supported Netmiko drivers",
          className: "max-w-[520px]",
          cell: (brand) => (
            <div className="flex flex-wrap gap-1">
              {brand.supported_drivers.map((driver) => (
                <code
                  key={driver}
                  className="rounded-md border bg-background px-2 py-1 type-caption text-blue-400"
                >
                  {driver}
                </code>
              ))}
            </div>
          ),
        },
        {
          id: "devices",
          header: "Devices",
          accessorKey: "device_count",
          className: "text-xs",
        },
        {
          id: "actions",
          header: null,
          headerClassName: "w-10",
          cell: (brand) => (
            <MoreMenu
              onView={() => onView(brand)}
              onEdit={() => onEdit(brand)}
              onCopy={() => navigator.clipboard?.writeText(brand.id)}
            />
          ),
        },
      ]}
    >
      <DataTablePanel>
        {children}
        <DataTableToolbar>
          <DataTableSearch placeholder="Search brand or Netmiko driver..." />
        </DataTableToolbar>
        <DataTableContent />
        <DataTablePagination itemLabel="brands" />
      </DataTablePanel>
    </DataTable>
  )
}
