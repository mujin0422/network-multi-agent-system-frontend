export type PageResponse<T> = {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type PageRequest = {
  page?: number
  page_size?: number
}
