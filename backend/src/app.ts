import type { Server } from "http";
import { serve } from "@hono/node-server"; // listens on PORT
import app from "./app.setup.js";
import { config } from "./config/env.js";
import { logger } from "./logger.js";
import { initSocket, closeSocket } from "./socket/emitter.js";
import { pool } from "./lib/db.js";

export function buildHttpServer(): Server {
  const httpServer = serve({
    fetch: app.fetch,
    port: config.PORT,
  }) as Server; // hono app http server create kre
  initSocket(httpServer); // Socket attach to get real-time updates   
  return httpServer;
}

//graceful shutdown
export function registerShutdownHandlers(server: Server): void {
  async function shutdown(signal: string): Promise<void> {
    logger.info({ signal }, "Shutdown signal received");

    setTimeout(() => {
      logger.error("Graceful shutdown timed out — forcing exit");
      process.exit(1);
    }, 10_000).unref(); // wait till 10s

    server.closeAllConnections();
    // closing taking new req
    server.close(async (err) => {
      if (err) {
        logger.error(err, "Error during graceful shutdown");
        process.exit(1);
      }
      await closeSocket(); // closeing socket connections
      await pool.end(); // closing db connections
      logger.info("Server closed gracefully");
      process.exit(0);
    });
  }

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
}

export function startServer(): Server {
  const server = buildHttpServer();
  logger.info({ port: config.PORT }, "Server running");
  registerShutdownHandlers(server);
  return server;
}

startServer();
