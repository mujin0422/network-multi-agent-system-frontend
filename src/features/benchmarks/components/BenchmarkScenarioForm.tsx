import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"

import { FeatureFormSheet, FormField } from "@/components/shared/FeatureFormSheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { isValidIPv4 } from "@/lib/ipv4"
import { devicesApi } from "@/service"
import type { ComboboxOption } from "@/types/components"
import type {
  BenchmarkAction,
  BenchmarkCheck,
  BenchmarkRootCause,
} from "@/service"
import type { BenchmarkScenarioFormProps } from "../types/benchmark.type"
import { isValidBenchmarkInterface } from "../utils/benchmark-interface.util"
import { BENCHMARK_ACTION_IPV4_FIELDS, BENCHMARK_ACTION_OPTIONS } from "../constants/benchmarks.constants"
import { generateBenchmarkCleanup } from "../utils/benchmark-cleanup.util"
import {
  createEmptyAction,
  createEmptyCheck,
  createEmptyRootCause,
} from "../utils/benchmark-scenario-form.util"
import { BenchmarkActionFields } from "./BenchmarkActionFields"
import { BenchmarkCheckFields } from "./BenchmarkCheckFields"
import { BenchmarkGroundTruthFields } from "./BenchmarkGroundTruthFields"
import { BenchmarkScenarioSection } from "./BenchmarkScenarioSection"

/** Form có cấu trúc để tạo mới hoặc chỉnh sửa toàn bộ benchmark scenario. */
export function BenchmarkScenarioForm({ scenario, open, onOpenChange, onSave }: BenchmarkScenarioFormProps) {
  const { t } = useTranslation()
  const [preconditions, setPreconditions] = useState<BenchmarkCheck[]>(scenario?.preconditions ?? [createEmptyCheck()])
  const [injection, setInjection] = useState<BenchmarkAction[]>(scenario?.injection ?? [createEmptyAction("interface_shutdown")])
  const [verification, setVerification] = useState<BenchmarkCheck[]>(scenario?.fault_verification ?? [createEmptyCheck()])
  const [groundTruth, setGroundTruth] = useState<BenchmarkRootCause[]>(scenario?.ground_truth ?? [createEmptyRootCause()])
  // Existing scenarios retain their saved cleanup until the user explicitly regenerates.
  const [cleanup, setCleanup] = useState<BenchmarkAction[]>(scenario?.cleanup ?? [])
  const [autoCleanup, setAutoCleanup] = useState(!scenario)
  const [manualCleanupReviewed, setManualCleanupReviewed] = useState(false)
  const suggestedCleanup = useMemo(() => generateBenchmarkCleanup(injection), [injection])
  const cleanupActions = autoCleanup ? suggestedCleanup.actions : cleanup

  function changeInjection(actions: BenchmarkAction[]) {
    setInjection(actions)
    setManualCleanupReviewed(false)
  }

  function changeCleanup(actions: BenchmarkAction[]) {
    setCleanup(actions)
    // Editing a generated action intentionally switches to manual override.
    setAutoCleanup(false)
    setManualCleanupReviewed(false)
  }

  function changeAutoCleanup(enabled: boolean) {
    if (!enabled) {
      // Keep the currently displayed proposal as an editable manual draft.
      setCleanup(suggestedCleanup.actions.map((action) => ({ ...action })))
    }
    setAutoCleanup(enabled)
    setManualCleanupReviewed(false)
  }

  function regenerateCleanup() {
    // Explicitly replace any manual edits with the current proposed actions.
    setAutoCleanup(true)
    setManualCleanupReviewed(false)
  }
  const [deviceOptions, setDeviceOptions] = useState<ComboboxOption[]>([])
  const [loadingDevices, setLoadingDevices] = useState(false)
  const [deviceError, setDeviceError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let active = true

    const loadDevices = async () => {
      setLoadingDevices(true)
      setDeviceError(null)
      try {
        const first = await devicesApi.list({ page: 1, page_size: 100 })
        const devices = [...first.items]
        for (let page = 2; page <= first.total_pages; page += 1) {
          if (!active) return
          const next = await devicesApi.list({ page, page_size: 100 })
          devices.push(...next.items)
        }
        if (!active) return
        // Benchmark API nhận hostname (P1/P2/PE1), không nhận device ID.
        const hostnames = [...new Set(devices.map((device) => device.hostname.trim()).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b))
        setDeviceOptions(hostnames.map((hostname) => ({ value: hostname, label: hostname })))
        if (hostnames.length === 0) setDeviceError(t("benchmarks.errors.noDevices"))
      } catch {
        if (active) setDeviceError(t("benchmarks.errors.loadDevices"))
      } finally {
        if (active) setLoadingDevices(false)
      }
    }

    void loadDevices()
    return () => { active = false }
  }, [open, t])

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={scenario ? "edit" : "create"}
      entityLabel={t("benchmarks.form.entity")}
      description={t("benchmarks.form.description")}
      contentClassName="data-[side=right]:sm:max-w-3xl!"
      onSubmit={async (data) => {
        const requiredTerms = String(data.get("evaluation_required_terms") ?? "")
          .split(/[\n,]+/)
          .map((item) => item.trim())
          .filter(Boolean)

        if (requiredTerms.length === 0) {
          throw new Error(t("benchmarks.errors.requiredTerms"))
        }

        if ([...preconditions, ...injection, ...verification, ...groundTruth, ...cleanupActions].some(
          (item) => !item.device.trim(),
        )) {
          throw new Error(t("benchmarks.errors.deviceRequired"))
        }

        const requiresInterface = new Set<BenchmarkAction["action"]>([
          "interface_shutdown",
          "interface_no_shutdown",
          "mpls_enable",
          "mpls_disable",
          "interface_ip_set",
          "acl_block",
          "acl_remove",
        ])
        const invalidActionInterface = [...injection, ...cleanupActions].some(
          (action) => requiresInterface.has(action.action) &&
            !isValidBenchmarkInterface(action.interface),
        )
        const invalidGroundTruthInterface = groundTruth.some(
          (cause) => Boolean(cause.interface) &&
            !isValidBenchmarkInterface(cause.interface),
        )

        if (invalidActionInterface || invalidGroundTruthInterface) {
          throw new Error(t("benchmarks.errors.invalidInterface"))
        }

        const invalidIPv4 = [...injection, ...cleanupActions].some((action) =>
          (BENCHMARK_ACTION_IPV4_FIELDS[action.action] ?? []).some(
            (field) => !isValidIPv4(action[field]),
          ),
        )
        if (invalidIPv4) {
          throw new Error(t("benchmarks.errors.invalidIPv4"))
        }

        const invalidBgpAs = [...injection, ...cleanupActions].some(
          (action) =>
            (action.action === "bgp_neighbor_shutdown" ||
              action.action === "bgp_neighbor_no_shutdown") &&
            (!Number.isInteger(action.local_as) ||
              action.local_as == null ||
              action.local_as < 1 ||
              action.local_as > 4294967295),
        )
        if (invalidBgpAs) {
          throw new Error(t("benchmarks.errors.invalidBgpAs"))
        }

        if (suggestedCleanup.manualSteps.length > 0 && autoCleanup) {
          throw new Error(t("benchmarks.errors.cleanupManualOverrideRequired"))
        }
        if (cleanupActions.length === 0) {
          throw new Error(t("benchmarks.errors.cleanupRequired"))
        }
        if (suggestedCleanup.manualSteps.length > 0 && !manualCleanupReviewed) {
          throw new Error(t("benchmarks.errors.cleanupReviewRequired"))
        }

        await onSave({
          scenario_key: String(data.get("scenario_key") ?? "").trim(),
          version: String(data.get("version") ?? "").trim(),
          name: String(data.get("name") ?? "").trim(),
          description: String(data.get("description") ?? "").trim(),
          topology: String(data.get("topology") ?? "").trim(),
          initial_message: String(data.get("initial_message") ?? "").trim(),
          preconditions,
          injection,
          fault_verification: verification,
          ground_truth: groundTruth,
          evaluation_required_terms: requiredTerms,
          cleanup: cleanupActions,
        })
        onOpenChange(false)
      }}
    >
      {loadingDevices && <p className="text-xs text-muted-foreground">{t("benchmarks.form.loadingDevices")}</p>}
      {deviceError && <p role="alert" className="text-xs text-destructive">{deviceError}</p>}
      <BenchmarkScenarioSection plain title={t("benchmarks.form.sections.information")} description={t("benchmarks.form.sections.informationDescription")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t("benchmarks.form.fields.name")} required>
            <Input name="name" required defaultValue={scenario?.name} placeholder="P3 interface link-down diagnosis" />
          </FormField>
          <FormField label={t("benchmarks.form.fields.scenarioKey")} required hint={t("benchmarks.form.hints.scenarioKey")}>
            <Input name="scenario_key" required readOnly={Boolean(scenario)} defaultValue={scenario?.scenario_key} pattern="[a-z0-9][a-z0-9-]*" placeholder="p3-interface-link-down" />
          </FormField>
          <FormField label={t("benchmarks.form.fields.version")} required>
            <Input name="version" required defaultValue={scenario?.version ?? "1.0"} placeholder="1.0" />
          </FormField>
          <FormField label={t("benchmarks.form.fields.topology")} required>
            <Input name="topology" required defaultValue={scenario?.topology ?? "mpls-core"} placeholder="mpls-core" />
          </FormField>
        </div>
        <FormField label={t("benchmarks.form.fields.description")} required>
          <Textarea name="description" required defaultValue={scenario?.description} rows={3} placeholder={t("benchmarks.form.placeholders.description")} />
        </FormField>
        <FormField label={t("benchmarks.form.fields.initialMessage")} required hint={t("benchmarks.form.hints.initialMessage")}>
          <Textarea name="initial_message" required defaultValue={scenario?.initial_message} rows={4} placeholder={t("benchmarks.form.placeholders.initialMessage")} />
        </FormField>
      </BenchmarkScenarioSection>

      <BenchmarkScenarioSection title={t("benchmarks.form.sections.preconditions")} description={t("benchmarks.form.sections.preconditionsDescription")}>
        <BenchmarkCheckFields section="preconditions" deviceOptions={deviceOptions} title={t("benchmarks.form.labels.precondition")} items={preconditions} onChange={setPreconditions} />
      </BenchmarkScenarioSection>

      <BenchmarkScenarioSection title={t("benchmarks.form.sections.injection")} description={t("benchmarks.form.sections.injectionDescription")}>
        <BenchmarkActionFields section="injection" deviceOptions={deviceOptions} title={t("benchmarks.form.labels.injection")} items={injection} defaultAction="interface_shutdown" onChange={changeInjection} />
      </BenchmarkScenarioSection>

      <BenchmarkScenarioSection title={t("benchmarks.form.sections.verification")} description={t("benchmarks.form.sections.verificationDescription")}>
        <BenchmarkCheckFields section="verification" deviceOptions={deviceOptions} title={t("benchmarks.form.labels.verification")} items={verification} onChange={setVerification} />
      </BenchmarkScenarioSection>

      <BenchmarkScenarioSection title={t("benchmarks.form.sections.groundTruth")} description={t("benchmarks.form.sections.groundTruthDescription")}>
        <BenchmarkGroundTruthFields deviceOptions={deviceOptions} items={groundTruth} onChange={setGroundTruth} />
        <FormField label={t("benchmarks.form.fields.requiredTerms")} required hint={t("benchmarks.form.hints.requiredTerms")}>
          <Textarea
            name="evaluation_required_terms"
            defaultValue={scenario?.evaluation_required_terms.join("\n")}
            required
            rows={4}
            className="font-mono text-xs"
            placeholder={"P3\nFastEthernet0/0\ndown"}
          />
        </FormField>
      </BenchmarkScenarioSection>

      <BenchmarkScenarioSection title={t("benchmarks.form.sections.cleanup")} description={t("benchmarks.form.sections.cleanupDescription")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <Switch
              type="button"
              size="sm"
              checked={autoCleanup}
              onCheckedChange={changeAutoCleanup}
              aria-label={t("benchmarks.form.cleanup.autoLabel")}
            />
            {t("benchmarks.form.cleanup.autoLabel")}
          </label>
          <Button type="button" size="sm" variant="outline" onClick={regenerateCleanup}>
            <RefreshCw aria-hidden="true" className="size-3.5" />
            {t("benchmarks.form.cleanup.regenerate")}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {autoCleanup
            ? t("benchmarks.form.cleanup.autoDescription", {
                count: suggestedCleanup.actions.length,
              })
            : t("benchmarks.form.cleanup.manualDescription")}
        </p>
        <div className="rounded-lg border border-border bg-background/70 p-3 text-xs text-muted-foreground">
          {t("benchmarks.form.cleanup.stateWarning")}
        </div>
        {suggestedCleanup.manualSteps.length > 0 && (
          <div role="alert" className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
            <div className="flex items-center gap-2 font-medium text-amber-500">
              <AlertTriangle aria-hidden="true" className="size-4 shrink-0" />
              {t("benchmarks.form.cleanup.manualWarning")}
            </div>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {suggestedCleanup.manualSteps.map((step) => {
                const actionOption = BENCHMARK_ACTION_OPTIONS.find(
                  (option) => option.value === step.action,
                )
                return (
                  <li key={step.injectionIndex}>
                    {t("benchmarks.form.cleanup.manualStep", {
                      index: step.injectionIndex,
                      action: actionOption ? t(actionOption.labelKey) : step.action,
                      device: step.device || "—",
                    })}
                  </li>
                )
              })}
            </ul>
            <p className="text-muted-foreground">
              {t("benchmarks.form.cleanup.manualWarningHelp")}
            </p>
            {!autoCleanup && (
              <label className="flex cursor-pointer items-start gap-2 pt-1 text-foreground">
                <input
                  type="checkbox"
                  checked={manualCleanupReviewed}
                  onChange={(event) => setManualCleanupReviewed(event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span>{t("benchmarks.form.cleanup.manualAcknowledgement")}</span>
              </label>
            )}
          </div>
        )}
        <BenchmarkActionFields
          section="cleanup"
          deviceOptions={deviceOptions}
          title={t("benchmarks.form.labels.cleanup")}
          items={cleanupActions}
          defaultAction="interface_no_shutdown"
          onChange={changeCleanup}
        />
      </BenchmarkScenarioSection>
    </FeatureFormSheet>
  )
}
