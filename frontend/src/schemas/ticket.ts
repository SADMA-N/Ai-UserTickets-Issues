import { z } from "zod";

export const TicketFormSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Subject required")
    .max(500, "Subject too long (max 500)"),
  body: z
    .string()
    .trim()
    .min(1, "Body required")
    .max(10_000, "Body too long (max 10000)"),
  email: z.string().trim().email("Invalid email"),
});

export type TicketFormValues = z.infer<typeof TicketFormSchema>;
