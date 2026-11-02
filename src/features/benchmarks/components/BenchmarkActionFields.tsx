import { FormField } from "@/components/shared/FeatureFormSheet"
import { BenchmarkDeviceCombobox } from "./BenchmarkDeviceCombobox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BenchmarkAction } from "@/service"
import { useTranslation } from "react-i18next"
import { BENCHMARK_ACTION_OPTIONS } from "../constants/benchmarks.constants"
import type { BenchmarkActionFieldsProps } from "../types/benchmark.type"
import { createEmptyAction } from "../utils/benchmark-scenario-form.util"

type ActionField = Exclude<keyof BenchmarkAction, "device" | "action">

/** Các trường bắt buộc theo đúng BenchmarkAction schema của backend. */
const ACTION_FIELDS: Record<BenchmarkAction["action"], ActionField[]> = {
  interface_shutdown: ["interface"],
  interface_no_shutdown: ["interface"],
  ospf_network_add: ["process_id", "network", "wildcard", "area"],
  ospf_network_remove: ["process_id", "network", "wildcard", "area"],
  mpls_enable: ["interface"],
  mpls_disable: ["interface"],
  default_route_add: ["next_hop"],
  default_route_remove: ["next_hop"],
  interface_ip_set: ["interface", "ip_address", "subnet_mask"],
  acl_block: ["interface", "acl_number", "direction", "source_network", "source_wildcard"],
  acl_remove: ["interface", "acl_number", "direction"],
}

const FIELD_LABELS: Record<ActionField, string> = {
  interface: "interface",
  process_id: "processId",
  network: "network",
  wildcard: "wildcard",
  area: "area",
  next_hop: "nextHop",
  ip_address: "ipAddress",
  subnet_mask: "subnetMask",
  acl_number: "aclNumber",
  direction: "direction",
  source_network: "sourceNetwork",
  source_wildcard: "sourceWildcard",
}

const NUMERIC_FIELDS = new Set<ActionField>(["process_id", "area", "acl_number"])

export function BenchmarkActionFields({ section, deviceOptions, title, items, defaultAction, onChange }: BenchmarkActionFieldsProps) {
  const { t } = useTranslation()

  function update(index: number, next: BenchmarkAction) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? next : item))
  }

  function renderActionField(item: BenchmarkAction, index: number, field: ActionField) {
    const label = t(`benchmarks.form.fields.${FIELD_LABELS[field]}`)
    if (field === "direction") {
      return (
        <FormField key={field} label={label} required>
          <select
            value={item.direction ?? ""}
            required
            className="h-control-md w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            onChange={(event) => update(index, { ...item, direction: event.target.value as "in" | "out" })}
          >
            <option value="" disabled>—</option>
            <option value="in">in</option>
            <option value="out">out</option>
          </select>
        </FormField>
      )
    }

    const numeric = NUMERIC_FIELDS.has(field)
    return (
      <FormField key={field} label={label} required>
        <Input
          type={numeric ? "number" : "text"}
          required
          min={numeric ? (field === "area" ? 0 : 1) : undefined}
          step={numeric ? 1 : undefined}
          value={item[field] ?? ""}
          className="font-mono"
          onChange={(event) => {
            const value = event.target.value
            const nextValue = numeric
              ? value === "" ? null : Number(value)
              : value
            update(index, { ...item, [field]: nextValue })
          }}
        />
      </FormField>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-lg border bg-background p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium">{title} {index + 1}</p>
            {items.length > 1 && (
              <Button type="button" size="xs" variant="ghost" className="text-destructive" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>
                {t("benchmarks.form.buttons.remove")}
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("benchmarks.form.fields.device")} required>
              <BenchmarkDeviceCombobox
                name={`benchmark-${section}-device-${index}`}
                value={item.device}
                options={deviceOptions}
                onChange={(value) => update(index, { ...item, device: value })}
              />
            </FormField>
            <FormField label={t("benchmarks.form.fields.action")} required>
              <select
                value={item.action}
                className="h-control-md w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                onChange={(event) => update(index, { ...createEmptyAction(event.target.value as BenchmarkAction["action"]), device: item.device })}
              >
                {BENCHMARK_ACTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
              </select>
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ACTION_FIELDS[item.action].map((field) => renderActionField(item, index, field))}
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, createEmptyAction(defaultAction)])}>{t("benchmarks.form.buttons.addAction")}</Button>
    </div>
  )
}
