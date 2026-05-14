import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePollTask } from "../lib/usePollTask";
import { Loader } from "../components/Loader";
import { ResultView } from "../components/ResultView";

export function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [retryNonce, setRetryNonce] = useState(0);
  const poll = usePollTask(taskId, retryNonce);

  if (!taskId) {
    return (
      <div className="p-6 text-slate-300">
        Missing task ID.{" "}
        <Link to="/" className="text-violet-400 underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6">
      {poll.status === "loading" && (
        <Loader
          message="Processing your ticket…"
          attempt={poll.attempt}
        />
      )}

      {poll.status === "done" && poll.task && <ResultView task={poll.task} />}

      {poll.status === "timeout" && (
        <div className="w-full max-w-xl mx-auto rounded-xl border border-amber-700 bg-amber-950/30 p-6 text-amber-100 space-y-3">
          <h2 className="text-lg font-semibold">
            Processing taking longer than expected
          </h2>
          <p className="text-sm">
            Task ID: <span className="font-mono">{taskId}</span>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRetryNonce((n) => n + 1)}
              className="rounded-md bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm"
            >
              Retry
            </button>
            <Link
              to="/"
              className="rounded-md bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 text-sm"
            >
              Start over
            </Link>
          </div>
        </div>
      )}

      {poll.status === "error" && (
        <div className="w-full max-w-xl mx-auto rounded-xl border border-red-700 bg-red-950/30 p-6 text-red-100 space-y-3">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm">{poll.error}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRetryNonce((n) => n + 1)}
              className="rounded-md bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm"
            >
              Retry
            </button>
            <Link
              to="/"
              className="rounded-md bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 text-sm"
            >
              Start over
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
