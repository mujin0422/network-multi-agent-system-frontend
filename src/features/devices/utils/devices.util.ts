import type { Brand } from "../types/brand.type"
import type { Category } from "../types/category.type"
import type { Device } from "../types/device.type"

export function catalogName(items: readonly (Brand | Category)[], id: string) {
  return items.find((item) => item.id === id)?.name ?? id
}

export function matchesDevice(device: Device, query: string, brandName: string, categoryName: string) {
  return [device.id, device.hostname, device.host, device.location ?? "", brandName, categoryName]
    .join(" ")
    .toLowerCase()
    .includes(query.trim().toLowerCase())
}
