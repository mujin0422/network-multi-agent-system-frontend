import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { FeatureFormSheet, FormField } from "@/components/shared/FeatureFormSheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { devicesApi } from "@/service"
import type { ComboboxOption } from "@/types/components"
import type {
  BenchmarkAction,
  BenchmarkCheck,
  BenchmarkRootCause,
} from "@/service"
import type { BenchmarkScenarioFormProps } from "../types/benchmark.type"
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
  const [cleanup, setCleanup] = useState<BenchmarkAction[]>(scenario?.cleanup ?? [createEmptyAction("interface_no_shutdown")])
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

        if ([...preconditions, ...injection, ...verification, ...groundTruth, ...cleanup].some(
          (item) => !item.device.trim(),
        )) {
          throw new Error(t("benchmarks.errors.deviceRequired"))
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
          cleanup,
        })
        onOpenChange(false)
      }}
    >
      {loadingDevices && <p className="text-xs text-muted-foreground">{t("benchmarks.form.loadingDevices")}</p>}
      {deviceError && <p role="alert" className="text-xs text-destructive">{deviceError}</p>}
      <BenchmarkScenarioSection title={t("benchmarks.form.sections.information")} description={t("benchmarks.form.sections.informationDescription")}>
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
        <BenchmarkActionFields section="injection" deviceOptions={deviceOptions} title={t("benchmarks.form.labels.injection")} items={injection} defaultAction="interface_shutdown" onChange={setInjection} />
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
        <BenchmarkActionFields section="cleanup" deviceOptions={deviceOptions} title={t("benchmarks.form.labels.cleanup")} items={cleanup} defaultAction="interface_no_shutdown" onChange={setCleanup} />
      </BenchmarkScenarioSection>
    </FeatureFormSheet>
  )
}
