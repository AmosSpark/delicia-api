import { Router, Express } from "express";

import {
  getItems,
  getTop5Items,
  getAnItem,
  postAnItem,
  updateAnItem,
  deleteAnItem,
  deleteAll,
} from "@/resources/controllers/item.controller";

import { ordersRouter } from "@/resources/routes/order.route";
import { reviewsRouter } from "@/resources/routes/review.route";
import { protectRoute } from "@/resources/controllers/auth.controller";

const itemsRouter = Router() as Express;

itemsRouter
  .route("/")
  .get(getItems)
  .post(protectRoute, postAnItem)
  .delete(protectRoute, deleteAll);

itemsRouter.route("/top-5-items").get(getTop5Items, getItems);

itemsRouter
  .route("/:id")
  .get(getAnItem)
  .patch(protectRoute, updateAnItem)
  .delete(protectRoute, deleteAnItem);

// /api/v1/items/:itemId/orders
itemsRouter.use("/:id/orders", protectRoute, ordersRouter);

// /api/v1/items/:itemId/reviews
itemsRouter.use("/:id/reviews", protectRoute, reviewsRouter);

export { itemsRouter };
