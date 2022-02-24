import express from "express";

import { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import { usersRouter, itemsRouter, ordersRouter } from "@/resources/routes";

// Application Variables

const app = express();
// Set security HTTP header
app.use(helmet());

app.use(cors());

// Body parser
app.use(express.json({ limit: "10kb" }));

// Data sanitzation against query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

app.use(express.urlencoded({ extended: false }));

// routes
app.get("/delecia", (req: Request, res: Response) => {
  res.send(`<h3>Welcome to Delicia!</h3>`);
});
app.use("/api/v1", usersRouter);
app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/orders", ordersRouter);

export { app };
