import type { BenchmarkAction } from "@/service"

/**
 * Stage 1: derive a proposed cleanup plan from declared fault injections.
 * This does NOT inspect the original device configuration.
 */
export const CLEANUP_INVERSES: Partial<
  Record<BenchmarkAction["action"], BenchmarkAction["action"]>
> = {
  interface_shutdown: "interface_no_shutdown",
  interface_no_shutdown: "interface_shutdown",
  mpls_enable: "mpls_disable",
  mpls_disable: "mpls_enable",
  ospf_network_add: "ospf_network_remove",
  ospf_network_remove: "ospf_network_add",
  default_route_add: "default_route_remove",
  default_route_remove: "default_route_add",
}

export type CleanupManualStep = {
  /** 1-based index in the original fault injection list. */
  injectionIndex: number
  action: BenchmarkAction["action"]
  device: string
}

export type CleanupPlan = {
  actions: BenchmarkAction[]
  manualSteps: CleanupManualStep[]
}

/**
 * Build the suggested cleanup in reverse injection order.
 * Preserve device and action parameters so OSPF/route pairs target the same values.
 *
 * interface_ip_set: cannot infer the previous IP/mask.
 * acl_block / acl_remove: ACLs can contain pre-existing rules or attachments;
 * blindly deleting/restoring the entire ACL is not a safe inverse.
 */
export function generateBenchmarkCleanup(
  injection: readonly BenchmarkAction[],
): CleanupPlan {
  const actions: BenchmarkAction[] = []
  const manualSteps: CleanupManualStep[] = []

  for (let index = injection.length - 1; index >= 0; index -= 1) {
    const source = injection[index]
    const inverse = CLEANUP_INVERSES[source.action]

    if (inverse) {
      actions.push({ ...source, action: inverse })
    } else {
      manualSteps.push({
        injectionIndex: index + 1,
        action: source.action,
        device: source.device,
      })
    }
  }

  return { actions, manualSteps }
}
