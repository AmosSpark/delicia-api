import { Router, Express } from "express";

import {
  getItems,
  getAnItem,
  postAnItem,
  updateAnItem,
  deleteAnItem,
  deleteAll,
} from "@/resources/controllers/item.controller";

import { protectRoute } from "@/resources/controllers/auth.controller";

const itemsRouter = Router() as Express;

itemsRouter
  .route("/")
  .get(getItems)
  .post(protectRoute, postAnItem)
  .delete(protectRoute, deleteAll);

itemsRouter
  .route("/:id")
  .get(getAnItem)
  .patch(protectRoute, updateAnItem)
  .delete(protectRoute, deleteAnItem);

export { itemsRouter };
