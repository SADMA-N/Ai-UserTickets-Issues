export type TaskState =
  | "pending"
  | "processing"
  | "completed"
  | "completed_with_fallback"
  | "needs_manual_review";

export const TERMINAL_STATES: TaskState[] = [
  "completed",
  "completed_with_fallback",
  "needs_manual_review",
];

export interface Phase1Output {
  summary: string;
  category: string;
  priority: "low" | "medium" | "high" | string;
  sentiment: "negative" | "neutral" | "positive" | string;
  routing_target: string;
  escalation_flag: boolean;
}

export interface Phase2Output {
  next_actions: string[];
  internal_note: string;
  response_draft: string;
}

export interface TaskResponse {
  task_id: string;
  state: TaskState;
  current_phase: string | null;
  retry_count?: { phase_1: number; phase_2: number };
  created_at: string;
  state_changed_at?: string;
  last_mutated_at?: string;
  outputs?: {
    phase_1?: Phase1Output | null;
    phase_2?: Phase2Output | null;
  };
  input_ticket?: unknown;
  fallback_info?: unknown;
}

export interface SubmitResponse {
  task_id: string;
  state: string;
  status_url: string;
}
