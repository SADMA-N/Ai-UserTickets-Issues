import type { Context } from "hono";
import { submitTicket } from "../services/ticketService.js";
import { TicketSchema } from "../schemas/ticket.js";

export const submitTickets = async (c: Context) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  // AC4 — validate input
  const { success, data: ticketData, error } = TicketSchema.safeParse(body);
  if (!success) {
    return c.json({ error: "Validation failed", details: error.issues }, 400);
  }

  // AC3 — persist before responding
  const taskData = await submitTicket(ticketData);

  // AC1 + AC2 — immediate 202
  return c.json(taskData, 202);
};
