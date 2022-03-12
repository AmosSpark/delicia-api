import express, { Request, Response, NextFunction } from "express";

import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";

import globalError from "@/middleware/global-error.middleware";
import {
  usersRouter,
  itemsRouter,
  ordersRouter,
  reviewsRouter,
} from "@/resources/routes";
import unhandledRoutes from "@/resources/controllers/unhandled-error.controller";

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

app.use(compression());

app.use(express.urlencoded({ extended: false }));

// routes
app.get("/delicia", (req: Request, res: Response) => {
  res.send(`<h3>Welcome to Delicia 🚀</h3>`);
});
app.use("/api/v1", usersRouter);
app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/reviews", reviewsRouter);
// unhandled routes
app.all("*", unhandledRoutes);
// global error
app.use(globalError);

export { app };
