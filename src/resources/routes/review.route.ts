import { Router, Express } from "express";

import { protectRoute } from "@/resources/controllers/auth.controller";

import {
  getReviews,
  createReview,
  updateReview,
  deleteAreview,
} from "@/resources/controllers/review.controller";

const reviewsRouter = Router({ mergeParams: true }) as Express;

reviewsRouter
  .route("/")
  .get(protectRoute, getReviews)
  .post(protectRoute, createReview);

reviewsRouter
  .route("/:id")
  .patch(protectRoute, updateReview)
  .delete(protectRoute, deleteAreview);

export { reviewsRouter };
