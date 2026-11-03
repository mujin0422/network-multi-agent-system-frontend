/** Parse four decimal IPv4 octets without enforcing subnet or wildcard semantics. */
export function isValidIPv4(value: string | null | undefined): boolean {
  if (!value || !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) return false

  return value.split(".").every((octet) => Number(octet) <= 255)
}

/** Keep empty octets while editing so incomplete values can be corrected. */
export function ipv4Octets(value: string | null | undefined): string[] {
  const octets = (value ?? "").split(".")
  return Array.from({ length: 4 }, (_, index) => octets[index] ?? "")
}
