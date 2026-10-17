import type { Brand } from "../types/brand.type"

/** Brand mock riêng của feature Devices, dùng cho bộ lọc và form thiết bị. */
export const MOCK_DEVICE_BRANDS: Brand[] = [
  { id: "brnd-0001", name: "Cisco", supported_drivers: ["cisco_ios", "cisco_ios_telnet"] },
  { id: "brnd-0005", name: "Fortinet", supported_drivers: ["fortinet"] },
  { id: "brnd-0004", name: "Huawei", supported_drivers: ["huawei"] },
  { id: "brnd-0003", name: "Juniper", supported_drivers: ["juniper_junos"] },
  { id: "brnd-0002", name: "MikroTik", supported_drivers: ["mikrotik_routeros"] },
]
