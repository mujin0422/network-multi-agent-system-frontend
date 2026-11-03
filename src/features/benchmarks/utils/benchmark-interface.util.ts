/**
 * Interface naming formats used in GNS3 benchmark scenarios.
 * The UI uses a fixed number of numeric segments per interface type.
 */
export const BENCHMARK_INTERFACE_TYPES = [
  "Ethernet",
  "FastEthernet",
  "GigabitEthernet",
  "TenGigabitEthernet",
  "TwentyFiveGigE",
  "FortyGigabitEthernet",
  "HundredGigE",
  "Loopback",
] as const

export type BenchmarkInterfaceType = (typeof BENCHMARK_INTERFACE_TYPES)[number]

export type BenchmarkInterfaceSelection = {
  type: BenchmarkInterfaceType
  parts: string[]
}

export function benchmarkInterfacePartCount(type: BenchmarkInterfaceType): 1 | 2 | 3 {
  if (type === "Loopback") return 1
  if (type === "Ethernet" || type === "FastEthernet") return 2
  return 3
}

/**
 * Parse stored interface strings, including earlier two-/three-segment formats.
 * A legacy value with the wrong segment count remains visible in edit mode,
 * but must be explicitly corrected before the scenario can be saved.
 */
export function parseBenchmarkInterface(
  value: string | null | undefined,
): BenchmarkInterfaceSelection | null {
  if (!value) return null

  const type = BENCHMARK_INTERFACE_TYPES.find((candidate) =>
    value.startsWith(candidate),
  )
  if (!type) return null

  const suffix = value.slice(type.length)
  if (!/^\d*(?:\/\d*){0,2}$/.test(suffix)) return null

  const parts = suffix.split("/")
  if (parts.length < 1 || parts.length > 3) return null
  return { type, parts }
}

export function isValidBenchmarkInterface(value: string | null | undefined): boolean {
  const selection = parseBenchmarkInterface(value)
  return Boolean(
    selection &&
    selection.parts.length === benchmarkInterfacePartCount(selection.type) &&
    selection.parts.every((part) =>
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
