import { Router, Express } from "express";

import { protectRoute } from "@/resources/controllers/auth.controller";

import {
  getOrders,
  makeAnOrder,
  getAnOrder,
  deleteAnOrder,
} from "@/resources/controllers/order.controller";

const ordersRouter = Router({ mergeParams: true }) as Express;

ordersRouter
  .route("/")
  .get(protectRoute, getOrders)
  .post(protectRoute, makeAnOrder);

ordersRouter
  .route("/:id")
  .get(protectRoute, getAnOrder)
  .delete(protectRoute, deleteAnOrder);

export { ordersRouter };
