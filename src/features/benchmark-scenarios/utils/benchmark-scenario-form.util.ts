import type { BenchmarkAction, BenchmarkCheck, BenchmarkRootCause } from "@/service"

export function createEmptyCheck(): BenchmarkCheck {
  return { device: "", command: "", assertion: { contains: "" } }
}

export function createEmptyAction(action: BenchmarkAction["action"]): BenchmarkAction {
  return { device: "", action }
}

export function createEmptyRootCause(): BenchmarkRootCause {
  return { fault_type: "link_down", device: "", interface: "" }
}
