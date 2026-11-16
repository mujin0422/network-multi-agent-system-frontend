import { api } from "@/service/api"
import type {
  Device,
  DeviceCreate,
  DeviceListParams,
  DevicePage,
  DeviceUpdate,
} from "@/service/contracts"

export const devicesApi = {
  list: async (params: DeviceListParams = {}) =>
    (await api.get<DevicePage>("/devices/", { params })).data,
  get: async (deviceId: string) => (await api.get<Device>(`/devices/${deviceId}`)).data,
  getByHostname: async (hostname: string) =>
    (await api.get<Device>(`/devices/by-hostname/${encodeURIComponent(hostname)}`)).data,
  create: async (payload: DeviceCreate) => (await api.post<Device>("/devices/", payload)).data,
  update: async (deviceId: string, payload: DeviceUpdate) =>
    (await api.patch<Device>(`/devices/${deviceId}`, payload)).data,
}
