import { api } from "@/service/api"
import type { Brand, BrandCreate, BrandUpdate, Category } from "@/service/contracts"

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
