import { Hono } from "hono";
import { getTaskStatus } from "../controllers/tasksController.js";

const tasksRouter = new Hono();

tasksRouter.get("/:taskId", getTaskStatus);

export default tasksRouter;
