import type {
  BenchmarkAction,
  BenchmarkCheck,
  BenchmarkRootCause,
  BenchmarkRun,
  BenchmarkScenario,
  BenchmarkScenarioCreate,
  BenchmarkScenarioDetail,
} from "@/service"
import type { ReactNode } from "react"
import type { ComboboxOption } from "@/types/components"

export type BenchmarkScenarioFormProps = {
  scenario?: BenchmarkScenarioDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: BenchmarkScenarioCreate) => Promise<void>
}

export type BenchmarkCheckFieldsProps = {
  section: "preconditions" | "verification"
  deviceOptions: readonly ComboboxOption[]
  title: string
  items: BenchmarkCheck[]
  onChange: (items: BenchmarkCheck[]) => void
}

export type BenchmarkActionFieldsProps = {
  section: "injection" | "cleanup"
  deviceOptions: readonly ComboboxOption[]
  title: string
  items: BenchmarkAction[]
  defaultAction: BenchmarkAction["action"]
  onChange: (items: BenchmarkAction[]) => void
}

export type BenchmarkGroundTruthFieldsProps = {
  deviceOptions: readonly ComboboxOption[]
  items: BenchmarkRootCause[]
  onChange: (items: BenchmarkRootCause[]) => void
}

export type BenchmarkScenarioSectionProps = {
  title: string
  description: string
  children: ReactNode
}

export type BenchmarkScenarioCardProps = {
  scenario: BenchmarkScenario
  busy: boolean
  startDisabled: boolean
  editLoading: boolean
  onEdit: (scenarioId: string) => void
  onStart: (scenarioId: string) => void
  onToggle: (scenario: BenchmarkScenario) => void
}

export type BenchmarkCurrentRunProps = {
  run: BenchmarkRun
  busy: boolean
  onOpenChat: () => void
  onCleanup: () => void
  onViewEvaluation: () => void
}

export type BenchmarkRunHistoryProps = {
  runs: BenchmarkRun[]
  onSelect: (run: BenchmarkRun) => void
}

export type BenchmarkSummary = {
  total: number
  inProgress: number
  completed: number
  needsAttention: number
}
