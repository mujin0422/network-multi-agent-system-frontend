/**
 * Common physical interface names supported by benchmark scenarios.
 * Cisco IOS / IOS XE may use two or three numeric segments depending on the platform.
 */
export const BENCHMARK_INTERFACE_TYPES = [
  "Ethernet",
  "FastEthernet",
  "GigabitEthernet",
  "TenGigabitEthernet",
  "TwentyFiveGigE",
  "FortyGigabitEthernet",
  "HundredGigE",
] as const

export type BenchmarkInterfaceType = (typeof BENCHMARK_INTERFACE_TYPES)[number]
export type BenchmarkInterfaceSelection = {
  type: BenchmarkInterfaceType
  parts: string[]
}

export function defaultInterfacePartCount(type: BenchmarkInterfaceType): 2 | 3 {
  return type === "Ethernet" || type === "FastEthernet" || type === "GigabitEthernet"
    ? 2
    : 3
}

/** Parse both complete and in-progress values without losing an empty numeric field. */
export function parseBenchmarkInterface(
  value: string | null | undefined,
): BenchmarkInterfaceSelection | null {
  if (!value) return null

  const type = BENCHMARK_INTERFACE_TYPES.find((candidate) =>
    value.startsWith(candidate),
  )
  if (!type) return null

  const suffix = value.slice(type.length)
  if (!/^\d*(?:\/\d*){1,2}$/.test(suffix)) return null

  const parts = suffix.split("/")
  if (parts.length !== 2 && parts.length !== 3) return null
  return { type, parts }
}

export function isValidBenchmarkInterface(value: string | null | undefined): boolean {
  const selection = parseBenchmarkInterface(value)
  return Boolean(
    selection?.parts.every((part) =>
      /^\d+$/.test(part) && Number.isSafeInteger(Number(part)),
    ),
  )
}

export function formatBenchmarkInterface(
  type: BenchmarkInterfaceType,
  parts: readonly string[],
): string {
  return `${type}${parts.join("/")}`
}
