import type { SubmitResponse, TaskResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export interface SubmitPayload {
  subject: string;
  body: string;
  customer: { id: string; email: string };
}

export async function submitTicket(
  payload: SubmitPayload,
): Promise<SubmitResponse> {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(
      errBody?.error ?? errBody?.message ?? `Submit failed (${res.status})`,
    );
  }

  return res.json();
}

export async function fetchTask(taskId: string): Promise<TaskResponse> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch task (${res.status})`);
  }
  return res.json();
}
