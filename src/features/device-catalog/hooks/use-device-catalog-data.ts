import { useCallback, useEffect, useMemo, useState } from "react"
import { brandsApi, categoriesApi, devicesApi } from "@/service"
import type { BrandCreate, BrandUpdate } from "@/service"
import type { Brand } from "../types/brand.type"
import type { Category } from "../types/category.type"
import type { CatalogEntity } from "../types/catalog-entity.type"

export function useDeviceCatalogData() {
  const [entity, setEntity] = useState<CatalogEntity>("brand")
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reload = useCallback(async () => {
    try {
      const [brandRows, categoryRows, page] = await Promise.all([brandsApi.list(), categoriesApi.list(), devicesApi.list({ page_size: 100 })])
      setBrands(brandRows.map((brand) => ({ ...brand, device_count: page.items.filter((device) => device.brand_id === brand.id).length })))
      setCategories(categoryRows.map((category) => ({ ...category, description: null, device_count: page.items.filter((device) => device.category_id === category.id).length })))
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải danh mục") }
    finally { setLoading(false) }
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reload() }, [reload])
  const createBrand = useCallback(async (payload: BrandCreate) => { await brandsApi.create(payload); await reload() }, [reload])
  const updateBrand = useCallback(async (id: string, payload: BrandUpdate) => { await brandsApi.update(id, payload); await reload() }, [reload])
  const summary = useMemo(() => ({
    brands: brands.length,
    categories: categories.length,
    drivers: new Set(brands.flatMap((brand) => brand.supported_drivers)).size,
    assignedDevices: categories.reduce((total, category) => total + category.device_count, 0),
  }), [brands, categories])
  return { entity, brands, categories, summary, loading, error, reload, createBrand, updateBrand, selectEntity: setEntity }
}
