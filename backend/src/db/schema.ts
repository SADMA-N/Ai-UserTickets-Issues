import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const taskStateEnum = pgEnum("TaskState", [
  "pending",
  "processing",
  "completed",
  "completed_with_fallback",
  "needs_manual_review",
]);

export const TaskState = {
  pending: "pending",
  processing: "processing",
  completed: "completed",
  completed_with_fallback: "completed_with_fallback",
  needs_manual_review: "needs_manual_review",
} as const;
export type TaskState = (typeof TaskState)[keyof typeof TaskState];

export const tasks = pgTable(
  "Task",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    state: taskStateEnum("state").notNull().default("pending"),
    currentPhase: text("currentPhase"),
    phase1Retries: integer("phase1Retries").notNull().default(0),
    phase2Retries: integer("phase2Retries").notNull().default(0),
    phase1Done: boolean("phase1Done").notNull().default(false),
    phase2Done: boolean("phase2Done").notNull().default(false),
    inputTicket: jsonb("inputTicket").notNull(),
    phase1Output: jsonb("phase1Output"),
    phase2Output: jsonb("phase2Output"),
    fallbackReason: text("fallbackReason"),
    fallbackAt: timestamp("fallbackAt", { precision: 3, mode: "date" }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow(),
    stateChangedAt: timestamp("stateChangedAt", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow(),
    lastMutatedAt: timestamp("lastMutatedAt", { precision: 3, mode: "date" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("Task_state_idx").on(t.state),
    index("Task_createdAt_idx").on(t.createdAt),
  ],
);

export type Task = typeof tasks.$inferSelect; //creates a TypeScript type for data to read data from the database.

export type NewTask = typeof tasks.$inferInsert; //Drizzle schema dekhe automatically type banano
