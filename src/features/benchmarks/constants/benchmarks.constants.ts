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
