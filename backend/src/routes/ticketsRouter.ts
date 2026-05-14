import { Hono } from "hono";
import { submitTickets } from "../controllers/ticketsController.js";

const ticketsRouter = new Hono();

ticketsRouter.post("/", submitTickets);

export default ticketsRouter;
