import type { Device } from "../types/device.type"

const DEVICE_AUDIT_FIELDS = {
  credential_id: "cred-171026-0001",
  brand_id: "brnd-0001",
  host: "127.0.0.1",
  device_type: "cisco_ios_telnet",
  location: "GNS3 Lab",
  created_by: "user-171026-0001",
  last_updated_by: "user-171026-0001",
  created_at: "2026-10-17T10:01:17.201709+07:00",
  last_updated_at: "2026-10-17T10:01:17.201709+07:00",
} as const

export const MOCK_DEVICES: Device[] = [
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0001", category_id: "catg-0001", hostname: "P1", port: 5000 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0002", category_id: "catg-0001", hostname: "P2", port: 5001 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0003", category_id: "catg-0001", hostname: "PE1", port: 5002 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0004", category_id: "catg-0001", hostname: "PE2", port: 5003 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0005", category_id: "catg-0001", hostname: "CE-1A", port: 5004 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0006", category_id: "catg-0001", hostname: "CE-1B", port: 5005 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0007", category_id: "catg-0001", hostname: "CE-2A", port: 5006 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0008", category_id: "catg-0001", hostname: "CE-2B", port: 5007 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0009", category_id: "catg-0002", hostname: "Switch1", port: 5008 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0010", category_id: "catg-0002", hostname: "Switch2", port: 5009 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0011", category_id: "catg-0002", hostname: "Switch3", port: 5010 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0012", category_id: "catg-0002", hostname: "Switch4", port: 5011 },
  { ...DEVICE_AUDIT_FIELDS, id: "devc-171026-0013", category_id: "catg-0001", hostname: "P3", port: 5024 },
]
