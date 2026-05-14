import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import ticketsRouter from "./routes/ticketsRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
import { logger } from "./logger.js";
import { config } from "./config/env.js";

export type AppEnv = {
  Variables: {
    requestId: string;
  };
};

export function createApp() {
  const app = new Hono<AppEnv>();

  app.use(
    "*",
    cors({
      origin: config.CORS_ORIGIN,
      credentials: false,
    }),
  );

  app.use(
    "*",
    bodyLimit({
      maxSize: 100 * 1024,
      onError: (c) =>
        c.json({ status: "fail", message: "Payload too large" }, 413),
    }),
  );

  app.use("*", async (c, next) => {
    const requestId = c.req.header("x-request-id") ?? randomUUID();
    c.set("requestId", requestId);
    c.header("x-request-id", requestId);
    await next();
  });

  app.route("/tickets", ticketsRouter);
  app.route("/tasks", tasksRouter);

  app.notFound((c) =>
    c.json({ status: "fail", message: "Route not found" }, 404),
  );

  app.onError((err, c) => {
    const error = err instanceof Error ? err : new Error(String(err));
    const raw = err as unknown as Record<string, unknown>;
    const status =
      (raw["status"] as number | undefined) ??
      (raw["statusCode"] as number | undefined) ??
      500;
    const isClientError = status < 500;

    if (!isClientError) {
      logger.error(error, "Unhandled error");
    }

    return c.json(
      isClientError
        ? { status: "fail", message: error.message }
        : { status: "error", message: "Internal server error" },
      status as ContentfulStatusCode,
    );
  });

  return app;
}

export default createApp();
