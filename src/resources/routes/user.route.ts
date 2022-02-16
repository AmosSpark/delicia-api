import { Router, Express } from "express";

import { protectRoute } from "@/resources/controllers/auth.controller";

import {
  getAllUser,
  getAuser,
  updateAuser,
  deleteAuser,
} from "@/resources/controllers/user.controller";

import {
  createNewUser,
  logUserIn,
} from "@/resources/controllers/auth.controller";

const usersRouter = Router() as Express;

usersRouter.route("/signup").post(createNewUser);

usersRouter.route("/login").post(logUserIn);

usersRouter.route("/users").get(protectRoute, getAllUser);

usersRouter
  .route("/users/:id")
  .get(protectRoute, getAuser)
  .patch(protectRoute, updateAuser)
  .delete(protectRoute, deleteAuser);

export { usersRouter };
