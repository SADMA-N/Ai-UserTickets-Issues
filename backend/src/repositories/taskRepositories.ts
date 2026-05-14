import { eq, sql } from "drizzle-orm";
import { db } from "../lib/db.js";
import { tasks, type Task } from "../db/schema.js";
import { Ticket } from "../schemas/ticket.js";

type Increment = { increment: number };
type Mutable = Omit<
  Task,
  "id" | "createdAt" | "lastMutatedAt" | "phase1Retries" | "phase2Retries"
>; // exclude this types frm Task

// making optional to Mutable types using Partial
export type TaskUpdate = Partial<Mutable> & {
  phase1Retries?: number | Increment;
  phase2Retries?: number | Increment;
};

const isIncrement = (v: unknown): v is Increment =>
  typeof v === "object" && v !== null && "increment" in v;

export async function createTask(inputTicket: Ticket) {
  const [row] = await db
    .insert(tasks)
    .values({ inputTicket: inputTicket as object }) // database er jsonb column object expect kore
    .returning();
  return row;
}

export async function deleteTask(id: string) {
  const [row] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  return row;
}

export async function getTask(id: string) {
  const [row] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return row ?? null; //row = null/undefined,return  null
}

export async function updateTask(id: string, data: TaskUpdate) {
  const { phase1Retries, phase2Retries, ...rest } = data;
  const set: Record<string, unknown> = { ...rest, lastMutatedAt: new Date() };

  if (phase1Retries !== undefined) {
    set.phase1Retries = isIncrement(phase1Retries)
      ? sql`${tasks.phase1Retries} + ${phase1Retries.increment}`
      : phase1Retries;
  }
  if (phase2Retries !== undefined) {
    set.phase2Retries = isIncrement(phase2Retries)
      ? sql`${tasks.phase2Retries} + ${phase2Retries.increment}`
      : phase2Retries;
  }

  const [row] = await db
    .update(tasks)
    .set(set)
    .where(eq(tasks.id, id))
    .returning();
  return row;
}
