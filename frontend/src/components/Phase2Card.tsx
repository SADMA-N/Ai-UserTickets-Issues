import { useState } from "react";
import type { Phase2Output } from "../types";

export function Phase2Card({ data }: { data: Phase2Output }) {
  const [showNote, setShowNote] = useState(false);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 space-y-4">
      <h2 className="text-lg font-semibold text-slate-100">
        Phase 2 · Response
      </h2>

      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Response draft
        </p>
        <div className="rounded-md bg-slate-950/60 border border-slate-800 p-4 text-slate-100 whitespace-pre-wrap leading-relaxed">
          {data.response_draft}
        </div>
      </div>

      {data.next_actions?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Next actions
          </p>
          <ul className="list-disc list-inside text-slate-200 space-y-1">
            {data.next_actions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </div>
      )}

      {data.internal_note && (
        <div>
          <button
            type="button"
            onClick={() => setShowNote((v) => !v)}
            className="text-xs text-violet-400 hover:text-violet-300 underline"
          >
            {showNote ? "Hide" : "Show"} internal note
          </button>
          {showNote && (
            <p className="mt-2 text-sm text-slate-300 bg-slate-950/40 border border-slate-800 rounded p-3">
              {data.internal_note}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
