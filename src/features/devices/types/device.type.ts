export type Device = {
  id: string
  credential_id: string | null
  brand_id: string
  category_id: string
  hostname: string
  host: string
  port: number
  device_type: string
  location: string | null
  created_by: string
  last_updated_by: string
  created_at: string
  last_updated_at: string
}
