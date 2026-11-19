import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import ts from "typescript"

// Compile the pure TypeScript helper without introducing a browser or test framework.
const source = readFileSync(
  new URL("../src/features/dashboard/utils/benchmark-tsr.util.ts", import.meta.url),
  "utf8",
)
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const { summarizeBenchmarkRuns } = await import(
  "data:text/javascript;base64," + Buffer.from(javascript).toString("base64")
)

function run(id, status, { source = "mesg-1", evaluation = null, error = null, rca = null } = {}) {
  return {
    id,
    status,
    source_message_id: source,
    evaluation_id: evaluation,
    evaluation_result: rca,
    error_message: error,
  }
}

function scored(id, goal) {
  return { id, evaluation_status: "COMPLETED", results: { GOAL: goal } }
}

test("GOAL is authoritative: RCA PASS cannot turn GOAL FAIL into TSR success", () => {
  const runs = [
    run("r1", "CLEANED", { evaluation: "ev1", rca: "PASS" }),
    run("r2", "COMPLETED", { evaluation: "ev2", rca: "FAIL" }),
  ]
  const summary = summarizeBenchmarkRuns(runs, [scored("ev1", "FAIL"), scored("ev2", "PASS")])
  assert.equal(summary.passed, 1)
  assert.equal(summary.failed, 1)
  assert.equal(summary.eligible_runs, 2)
  assert.equal(summary.success_rate, 50)
})

test("FAILED after Chat counts in TSR; setup failures and in-progress runs do not", () => {
  const runs = [
    run("r1", "FAILED", { source: "mesg-1", error: "worker failed" }),
    run("r2", "FAILED", { source: null, error: "cannot inject fault" }),
    run("r3", "RUNNING"),
    run("r4", "CLEANED", { evaluation: "ev4" }),
  ]
  const summary = summarizeBenchmarkRuns(runs, [scored("ev4", "PASS")])
  assert.equal(summary.passed, 1)
  assert.equal(summary.failed, 1)
  assert.equal(summary.setup_failed, 1)
  assert.equal(summary.in_progress, 1)
  assert.equal(summary.eligible_runs, 2)
  assert.equal(summary.success_rate, 50)
})

test("missing GOAL is unscored unless there is a definitive execution error", () => {
  const runs = [
    run("r1", "COMPLETED", { evaluation: "ev1" }),
    run("r2", "CLEANED", { error: "workflow error" }),
    run("r3", "READY", { source: null }),
    run("r4", "CLEANED", { source: null }),
  ]
  const summary = summarizeBenchmarkRuns(runs, [scored("ev1", "UNKNOWN")])
  assert.equal(summary.unscored, 1)
  assert.equal(summary.failed, 1)
  assert.equal(summary.not_started, 2)
  assert.equal(summary.eligible_runs, 1)
  assert.equal(summary.success_rate, 0)
})

test("no eligible attempts produces null TSR rather than inventing zero percent", () => {
  const summary = summarizeBenchmarkRuns([run("r1", "READY", { source: null })], [])
  assert.equal(summary.total_runs, 1)
  assert.equal(summary.eligible_runs, 0)
  assert.equal(summary.success_rate, null)
})
