import { Link } from "react-router-dom";
import type { TaskResponse } from "../types";
import { Phase1Card } from "./Phase1Card";
import { Phase2Card } from "./Phase2Card";
import { FallbackBanner } from "./FallbackBanner";

export function ResultView({ task }: { task: TaskResponse }) {
  const phase1 = task.outputs?.phase_1 ?? null;
  const phase2 = task.outputs?.phase_2 ?? null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            Ticket result
          </h1>
          <p className="text-xs text-slate-500 font-mono">{task.task_id}</p>
        </div>
        <Link
          to="/"
          className="text-sm text-violet-400 hover:text-violet-300 underline"
        >
          Submit another
        </Link>
      </header>

      {task.state === "needs_manual_review" && (
        <section className="rounded-xl border border-sky-700 bg-sky-950/30 p-5 text-sky-100">
          <h2 className="text-lg font-semibold mb-1">
            Ticket escalated for manual review
          </h2>
          <p className="text-sm text-sky-200">
            Our AI couldn't process this automatically. A support agent will
            reach out to you shortly.
          </p>
        </section>
      )}

      {task.state === "completed_with_fallback" && <FallbackBanner />}

      {phase1 && <Phase1Card data={phase1} />}
      {phase2 && <Phase2Card data={phase2} />}
    </div>
  );
}
