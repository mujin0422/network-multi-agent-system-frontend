import { api } from "./api"
import type {
  Brand,
  BrandCreate,
  BrandUpdate,
  Category,
  Credential,
  CredentialCreate,
  CredentialUpdate,
  Device,
  DeviceCreate,
  DeviceListParams,
  DevicePage,
  DeviceUpdate,
} from "./contracts"

export const brandsApi = {
  list: async () => (await api.get<Brand[]>("/brands/")).data,
  get: async (brandId: string) => (await api.get<Brand>(`/brands/${brandId}`)).data,
  create: async (payload: BrandCreate) => (await api.post<Brand>("/brands/", payload)).data,
  update: async (brandId: string, payload: BrandUpdate) =>
    (await api.patch<Brand>(`/brands/${brandId}`, payload)).data,
}

export const categoriesApi = {
  list: async () => (await api.get<Category[]>("/categories/")).data,
}

export const credentialsApi = {
  list: async () => (await api.get<Credential[]>("/credentials/")).data,
  get: async (credentialId: string) =>
    (await api.get<Credential>(`/credentials/${credentialId}`)).data,
  create: async (payload: CredentialCreate) =>
    (await api.post<Credential>("/credentials/", payload)).data,
  update: async (credentialId: string, payload: CredentialUpdate) =>
    (await api.patch<Credential>(`/credentials/${credentialId}`, payload)).data,
}

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
