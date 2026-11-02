import {
  DataTable,
  DataTableContent,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
} from "@/components/shared/DataTable"
import { MoreMenu } from "@/components/shared/MoreMenu"
import type { Category } from "../types/category.type"

export function CategoryTable({
  categories,
  onView,
  onEdit,
}: {
  categories: Category[]
  onView: (category: Category) => void
  onEdit?: (category: Category) => void
}) {
  return (
    <DataTable
      data={categories}
      getRowId={(category) => category.id}
      searchValue={(category) =>
        `${category.name} ${category.id} ${category.description}`
      }
      columns={[
        {
          id: "category",
          header: "Category",
          headerClassName: "pl-4",
          className: "pl-4",
          cell: (category) => (
            <div className="min-w-0">
              <p className="text-xs font-medium">{category.name}</p>
              <p className="mt-1 font-mono type-caption text-success">{category.id}</p>
            </div>
          ),
        },
        {
          id: "description",
          header: "Description",
          accessorKey: "description",
          className: "max-w-[520px] text-xs text-muted-foreground",
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
          cell: (category) => (
            <MoreMenu
              onView={() => onView(category)}
              onEdit={onEdit ? () => onEdit(category) : undefined}
              onCopy={() => navigator.clipboard?.writeText(category.id)}
            />
          ),
        },
      ]}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search category or description..." />
        </DataTableToolbar>
        <DataTableContent />
        <DataTablePagination itemLabel="categories" />
      </DataTablePanel>
    </DataTable>
  )
}
