import { FormField } from "@/components/shared/FeatureFormSheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BenchmarkCheck } from "@/service"
import { useTranslation } from "react-i18next"
import type { BenchmarkCheckFieldsProps } from "../types/benchmark.type"
import { createEmptyCheck } from "../utils/benchmark-scenario-form.util"

export function BenchmarkCheckFields({ title, items, onChange }: BenchmarkCheckFieldsProps) {
  const { t } = useTranslation()

  function update(index: number, next: BenchmarkCheck) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? next : item))
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
              <Input value={item.device} required placeholder="P3" onChange={(event) => update(index, { ...item, device: event.target.value })} />
            </FormField>
            <FormField label={t("benchmarks.form.fields.expectedOutput")} required>
              <Input value={item.assertion.contains} required placeholder="administratively down" onChange={(event) => update(index, { ...item, assertion: { contains: event.target.value } })} />
            </FormField>
          </div>
          <FormField label={t("benchmarks.form.fields.command")} required>
            <Input value={item.command} required className="font-mono" placeholder="show interfaces FastEthernet0/0 | include line protocol" onChange={(event) => update(index, { ...item, command: event.target.value })} />
          </FormField>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, createEmptyCheck()])}>{t("benchmarks.form.buttons.addCheck")}</Button>
    </div>
  )
}
