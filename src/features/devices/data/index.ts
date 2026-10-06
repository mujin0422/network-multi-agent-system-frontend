import type { Brand, Category, Device } from "../types"

export const MOCK_BRANDS: Brand[] = [{ id: "brnd-0001", name: "Cisco" }, { id: "brnd-0002", name: "Juniper" }, { id: "brnd-0003", name: "Fortinet" }]
export const MOCK_CATEGORIES: Category[] = [{ id: "catg-0001", name: "Router" }, { id: "catg-0002", name: "Switch" }, { id: "catg-0003", name: "Firewall" }]
export const MOCK_DEVICES: Device[] = [
  { id: "devc-031026-0001", credential_id: "cred-011026-0001", brand_id: "brnd-0001", category_id: "catg-0001", last_updated_by: "user-011026-0001", hostname: "P1-CORE-HCM", host: "10.10.0.11", port: 22, device_type: "cisco_ios", location: "DC HCM · Rack A02", created_at: "2026-10-01T08:15:00+07:00", last_updated_at: "2026-10-03T09:42:00+07:00", connection_status: "CONNECTED" },
  { id: "devc-031026-0002", credential_id: "cred-011026-0001", brand_id: "brnd-0001", category_id: "catg-0001", last_updated_by: "user-011026-0002", hostname: "P2-CORE-HN", host: "10.10.0.12", port: 22, device_type: "cisco_ios", location: "DC Hà Nội · Rack B01", created_at: "2026-10-01T08:20:00+07:00", last_updated_at: "2026-10-03T09:38:00+07:00", connection_status: "CONNECTED" },
  { id: "devc-031026-0003", credential_id: "cred-011026-0002", brand_id: "brnd-0002", category_id: "catg-0002", last_updated_by: "user-011026-0001", hostname: "SW-ACCESS-01", host: "10.20.1.10", port: 830, device_type: "juniper_junos", location: "Office HCM · Floor 5", created_at: "2026-10-01T09:00:00+07:00", last_updated_at: "2026-10-03T08:15:00+07:00", connection_status: "CHECKING" },
  { id: "devc-031026-0004", credential_id: "cred-011026-0003", brand_id: "brnd-0003", category_id: "catg-0003", last_updated_by: "user-011026-0003", hostname: "FW-EDGE-01", host: "172.16.0.1", port: 22, device_type: "fortinet", location: "DC HCM · Edge", created_at: "2026-10-01T09:10:00+07:00", last_updated_at: "2026-10-02T23:07:00+07:00", connection_status: "UNREACHABLE" },
  { id: "devc-031026-0005", credential_id: null, brand_id: "brnd-0001", category_id: "catg-0002", last_updated_by: "user-011026-0002", hostname: "SW-LAB-02", host: "192.168.56.12", port: 23, device_type: "cisco_ios_telnet", location: "Automation Lab", created_at: "2026-10-02T14:30:00+07:00", last_updated_at: "2026-10-02T14:30:00+07:00", connection_status: "UNREACHABLE" },
]

MOCK_DEVICES.push(...Array.from({ length: 22 }, (_, index): Device => ({
  id: `devc-021026-${String(index + 6).padStart(4, "0")}`,
  credential_id: `cred-011026-000${index % 3 + 1}`,
  brand_id: `brnd-000${index % 3 + 1}`,
  category_id: `catg-000${index % 3 + 1}`,
  last_updated_by: `user-011026-000${index % 3 + 1}`,
  hostname: `${index % 3 === 0 ? "RTR" : index % 3 === 1 ? "SW" : "FW"}-BRANCH-${String(index + 1).padStart(2, "0")}`,
  host: `10.${30 + Math.floor(index / 10)}.${index % 10}.1`,
  port: index % 4 === 0 ? 23 : 22,
  device_type: index % 3 === 0 ? "cisco_ios" : index % 3 === 1 ? "juniper_junos" : "fortinet",
  location: `Branch ${String(index + 1).padStart(2, "0")}`,
  created_at: "2026-10-02T08:00:00+07:00",
  last_updated_at: `2026-10-03T${String(7 + index % 4).padStart(2, "0")}:15:00+07:00`,
  connection_status: index % 7 === 0 ? "UNREACHABLE" : index % 5 === 0 ? "CHECKING" : "CONNECTED",
})))
