import type { Context } from "hono";
import { z } from "zod";
import { getTaskById } from "../services/taskService.js";

const ParamsSchema = z.object({
  taskId: z.uuid(),
});

export const getTaskStatus = async (c: Context) => {
  const result = ParamsSchema.safeParse({ taskId: c.req.param("taskId") });

  if (!result.success) {
    return c.json(
      { error: "Invalid task ID", details: result.error.issues },
      400,
    );
  }

  const taskData = await getTaskById(result.data.taskId);

  if (!taskData) {
    return c.json({ error: "Task not found" }, 404);
  }

  return c.json(taskData, 200);
};
