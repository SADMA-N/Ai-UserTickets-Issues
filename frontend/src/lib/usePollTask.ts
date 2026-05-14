import { useEffect, useRef, useState } from "react";
import { fetchTask } from "./api";
import { TERMINAL_STATES, type TaskResponse } from "../types";

const INTERVAL_MS = 1500;
const MAX_ATTEMPTS = 60;

export type PollStatus = "loading" | "done" | "timeout" | "error";

export interface PollState {
  status: PollStatus;
  task?: TaskResponse;
  error?: string;
  attempt: number;
}

export function usePollTask(taskId: string | undefined, retryNonce = 0) {
  const [state, setState] = useState<PollState>({
    status: "loading",
    attempt: 0,
  });
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!taskId) return;
    cancelledRef.current = false;
    setState({ status: "loading", attempt: 0 });

    let attempt = 0;
    let timer: number | undefined;

    const tick = async () => {
      if (cancelledRef.current) return;
      attempt += 1;
      try {
        const task = await fetchTask(taskId);
        if (cancelledRef.current) return;

        if (TERMINAL_STATES.includes(task.state)) {
          setState({ status: "done", task, attempt });
          return;
        }

        if (attempt >= MAX_ATTEMPTS) {
          setState({ status: "timeout", task, attempt });
          return;
        }

        setState({ status: "loading", task, attempt });
        timer = window.setTimeout(tick, INTERVAL_MS);
      } catch (err) {
        if (cancelledRef.current) return;
        setState({
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
          attempt,
        });
      }
    };

    tick();

    return () => {
      cancelledRef.current = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [taskId, retryNonce]);

  return state;
}
