export type Device = {
  id: string; credential_id: string | null; brand_id: string; category_id: string; last_updated_by: string
  hostname: string; host: string; port: number; device_type: string; location: string | null
  created_at: string; last_updated_at: string; connection_status: "CONNECTED" | "UNREACHABLE" | "CHECKING"
}
export type Brand = { id: string; name: string }
export type Category = { id: string; name: string }
