import type { Brand } from "../types/brand.type"

export const MOCK_CATALOG_BRANDS: Brand[] = [
  { id: "brnd-0001", name: "Cisco", supported_drivers: ["cisco_ios", "cisco_ios_telnet"], device_count: 13 },
  { id: "brnd-0005", name: "Fortinet", supported_drivers: ["fortinet"], device_count: 0 },
  { id: "brnd-0004", name: "Huawei", supported_drivers: ["huawei"], device_count: 0 },
  { id: "brnd-0003", name: "Juniper", supported_drivers: ["juniper_junos"], device_count: 0 },
  { id: "brnd-0002", name: "MikroTik", supported_drivers: ["mikrotik_routeros"], device_count: 0 },
]
