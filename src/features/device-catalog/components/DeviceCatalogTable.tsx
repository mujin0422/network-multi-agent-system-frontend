import { useState } from "react"
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { Button } from "@/components/ui/button"
import type { FormMode } from "@/types/components"
import { useDeviceCatalogData } from "../hooks/use-device-catalog-data"
import type { CatalogEntity } from "../types/catalog-entity.type"
import type { CatalogRecord } from "../types/catalog-record.type"
import { entityLabel } from "../utils/device-catalog.util"
import { DeviceCatalogForm } from "./DeviceCatalogForm"
import { DeviceCatalogStats } from "./DeviceCatalogStats"
import { DeviceCatalogTabs } from "./DeviceCatalogTabs"
import { BrandTable } from "./BrandTable"
import { CategoryTable } from "./CategoryTable"

/** Màn hình quản lý master data brand và category cho inventory. */
export function DeviceCatalogTable() {
  const { entity, brands, categories, summary, selectEntity, createBrand, updateBrand } =
    useDeviceCatalogData()
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    entity: CatalogEntity
    record: CatalogRecord | null
  }>({ open: false, mode: "create", entity: "brand", record: null })
  const openForm = (
    mode: FormMode,
    formEntity: CatalogEntity,
    record: CatalogRecord | null = null,
  ) => setForm({ open: true, mode, entity: formEntity, record })

  return (
    <>
      <PageLayout>
        <PageLayoutHeader
          title="Device Catalog"
          description="Manage inventory brands, categories, and the Netmiko drivers allowed for each vendor."
        >
          <Button size="sm" disabled={entity === "category"} title={entity === "category" ? "Backend chưa có API tạo category" : undefined} onClick={() => openForm("create", entity)}>
            Add {entityLabel(entity)}
          </Button>
        </PageLayoutHeader>
        <DeviceCatalogStats summary={summary} />

        <PageLayoutContent>
          {entity === "brand" ? (
            <BrandTable
              brands={brands}
              onView={(brand) => openForm("view", "brand", brand)}
              onEdit={(brand) => openForm("edit", "brand", brand)}
            >
              <DeviceCatalogTabs entity={entity} onChange={selectEntity} />
            </BrandTable>
          ) : (
            <CategoryTable
              categories={categories}
              onView={(category) => openForm("view", "category", category)}
              onEdit={undefined}
            >
              <DeviceCatalogTabs entity={entity} onChange={selectEntity} />
            </CategoryTable>
          )}
        </PageLayoutContent>
      </PageLayout>
      <DeviceCatalogForm
        open={form.open}
        mode={form.mode}
        entity={form.entity}
        record={form.record}
        onSaveBrand={(name, supported_drivers) => form.mode === "create" ? createBrand({ name, supported_drivers }) : updateBrand(form.record!.id, { name, supported_drivers })}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
        onModeChange={(mode) => setForm((current) => ({ ...current, mode }))}
      />
    </>
  )
}
