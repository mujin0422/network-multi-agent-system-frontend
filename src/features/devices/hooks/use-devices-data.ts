import { useCallback, useEffect, useMemo, useState } from "react"
import { authApi } from "@/features/auth/api/auth.api"
import { brandsApi, categoriesApi } from "@/features/device-catalog/api/device-catalog.api"
import { credentialsApi } from "@/features/credentials/api/credentials.api"
import { usersApi } from "@/features/users/api/users.api"
import { devicesApi } from "../api/devices.api"
import type { Brand, Category, Credential, DeviceCreate, DeviceUpdate, User } from "@/service"
import type { Device } from "../types/device.type"
import { catalogName } from "../utils/devices.util"

export function useDevicesData() {
  const [rows, setRows] = useState<Device[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUserId, setCurrentUserId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reload = useCallback(async () => {
    try {
      const [page, brandRows, categoryRows, credentialRows, me, userRows] = await Promise.all([
        devicesApi.list({ page_size: 100 }), brandsApi.list(), categoriesApi.list(), credentialsApi.list(), authApi.me(), usersApi.list().catch(() => []),
      ])
      setRows(page.items); setBrands(brandRows); setCategories(categoryRows); setCredentials(credentialRows); setCurrentUserId(me.id); setUsers(userRows)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể tải thiết bị") }
    finally { setLoading(false) }
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với API khi mount.
  useEffect(() => { void reload() }, [reload])
  const createDevice = useCallback(async (payload: Omit<DeviceCreate, "last_updated_by">) => {
    await devicesApi.create({ ...payload, last_updated_by: currentUserId }); await reload()
  }, [currentUserId, reload])
  const updateDevice = useCallback(async (id: string, payload: Omit<DeviceUpdate, "last_updated_by">) => {
    await devicesApi.update(id, { ...payload, last_updated_by: currentUserId }); await reload()
  }, [currentUserId, reload])
  function brandName(id: string) { return catalogName(brands, id) }
  function categoryName(id: string) { return catalogName(categories, id) }
  function auditUserName(id: string | null) { return id ? users.find((user) => user.id === id)?.full_name ?? id : "—" }
  const summary = useMemo(() => ({
    total: rows.length,
    routers: rows.filter((device) => categories.find((category) => category.id === device.category_id)?.name.toLowerCase().includes("router")).length,
    switches: rows.filter((device) => categories.find((category) => category.id === device.category_id)?.name.toLowerCase().includes("switch")).length,
    deviceTypes: new Set(rows.map((device) => device.device_type)).size,
  }), [rows, categories])
  return { rows, brands, categories, credentials, summary, brandName, categoryName, auditUserName, loading, error, reload, createDevice, updateDevice }
}
