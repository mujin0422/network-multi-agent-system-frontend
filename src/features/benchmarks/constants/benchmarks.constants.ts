import type { BenchmarkAction, BenchmarkRun } from "@/service"

export const BENCHMARK_STATUS_KEYS: Record<BenchmarkRun["status"], string> = {
  PREPARING: "benchmarks.status.PREPARING",
  READY: "benchmarks.status.READY",
  RUNNING: "benchmarks.status.RUNNING",
  COMPLETED: "benchmarks.status.COMPLETED",
  FAILED: "benchmarks.status.FAILED",
  CLEANED: "benchmarks.status.CLEANED",
}

export const BENCHMARK_ACTION_OPTIONS: Array<{
  value: BenchmarkAction["action"]
  labelKey: string
}> = [
  { value: "interface_shutdown", labelKey: "benchmarks.form.actions.interfaceShutdown" },
  { value: "interface_no_shutdown", labelKey: "benchmarks.form.actions.interfaceNoShutdown" },
  { value: "ospf_network_add", labelKey: "benchmarks.form.actions.ospfNetworkAdd" },
  { value: "ospf_network_remove", labelKey: "benchmarks.form.actions.ospfNetworkRemove" },
  { value: "mpls_enable", labelKey: "benchmarks.form.actions.mplsEnable" },
  { value: "mpls_disable", labelKey: "benchmarks.form.actions.mplsDisable" },
  { value: "default_route_add", labelKey: "benchmarks.form.actions.defaultRouteAdd" },
  { value: "default_route_remove", labelKey: "benchmarks.form.actions.defaultRouteRemove" },
  { value: "interface_ip_set", labelKey: "benchmarks.form.actions.interfaceIpSet" },
  { value: "acl_block", labelKey: "benchmarks.form.actions.aclBlock" },
  { value: "acl_remove", labelKey: "benchmarks.form.actions.aclRemove" },
]

/** IPv4 fields expected by each benchmark action (without subnet/wildcard policy checks). */
export type BenchmarkIPv4ActionField =
  | "network"
  | "wildcard"
  | "next_hop"
  | "ip_address"
  | "subnet_mask"
  | "source_network"
  | "source_wildcard"

export const BENCHMARK_ACTION_IPV4_FIELDS: Partial<
  Record<BenchmarkAction["action"], readonly BenchmarkIPv4ActionField[]>
> = {
  ospf_network_add: ["network", "wildcard"],
  ospf_network_remove: ["network", "wildcard"],
  default_route_add: ["next_hop"],
  default_route_remove: ["next_hop"],
  interface_ip_set: ["ip_address", "subnet_mask"],
  acl_block: ["source_network", "source_wildcard"],
}
