import type { Phase1Output } from "../types";

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-600/30 text-red-200 border-red-700",
  medium: "bg-amber-600/30 text-amber-200 border-amber-700",
  low: "bg-emerald-600/30 text-emerald-200 border-emerald-700",
};

const SENTIMENT_COLORS: Record<string, string> = {
  negative: "bg-red-600/20 text-red-200 border-red-800",
  neutral: "bg-slate-600/30 text-slate-200 border-slate-600",
  positive: "bg-emerald-600/20 text-emerald-200 border-emerald-800",
};

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${color}`}
    >
      {label}
    </span>
  );
}

export function Phase1Card({ data }: { data: Phase1Output }) {
  const priorityClass =
    PRIORITY_COLORS[data.priority] ?? "bg-slate-700 text-slate-200 border-slate-600";
  const sentimentClass =
    SENTIMENT_COLORS[data.sentiment] ?? "bg-slate-700 text-slate-200 border-slate-600";

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">
          Phase 1 · Classification
        </h2>
        <div className="flex gap-2">
          <Badge color={priorityClass} label={`priority: ${data.priority}`} />
          <Badge color={sentimentClass} label={data.sentiment} />
        </div>
      </header>

      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Summary</p>
        <p className="text-slate-200">{data.summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
          <p className="text-slate-200">{data.category}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Routing target
          </p>
          <p className="text-slate-200">{data.routing_target}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Escalation flag
          </p>
          <p className="text-slate-200">
            {data.escalation_flag ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </section>
  );
}
