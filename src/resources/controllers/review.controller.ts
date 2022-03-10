import { Response, Request, NextFunction } from "express";

import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catch-async.utils";
import AppError from "@/utils/app-error.utils";
import User from "@/resources/models/user.model";
import Review from "@/resources/models/review.model";
import * as dotenv from "dotenv";

dotenv.config();

/*
 * @route GET api/v1/reveiews
 * @desc get all reveiw
 * @ascess private
 */

const getReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let itemId = {};
    if (req.params.itemId) itemId = { item: req.params.itemId };

    const reveiws = await Review.find(itemId);

    return res.status(200).json({
      status: `success`,
      results: reveiws.length,
      data: {
        reveiws,
      },
    });
  }
);

/*
 * @route POST api/v1/reveiews
 * @desc create a reveiw
 * @ascess private
 */

const createReview = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction) => {
    // get user
    const JWT_SECRET = String(process.env.JWT_SECRET);
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) return err;
      const user = await User.findById(decoded.id);
      req.user = user;

      try {
        // create review
        const newReview = await Review.create({
          rating: req.body.rating,
          comment: req.body.comment,
          item: req.params.id,
          user: req.user.id,
        });

        res.status(201).json({
          status: `success`,
          data: {
            review: newReview,
          },
        });
      } catch (error: any) {
        return next(new AppError(error.message, 400));
      }
      next();
    });
  }
);

/*
 * @route PATCH api/v1/reviews/:id
 * @desc update a review
 * @ascess private
 */

const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id,
      body = req.body;
    const reviewToUpdate = await Review.findByIdAndUpdate(id, body, {
      new: true,
      runValidator: true,
    }).clone();

    if (!reviewToUpdate) {
      return next(new AppError(`Review with 'id': ${id} not found`, 404));
    }

    res.status(200).json({
      status: `success`,
      data: {
        reviewToUpdate,
      },
    });
  }
);

/*
 * @route DELETE api/v1/reviews/:reviewId
 * @desc delete a reveiw of an item
 * @ascess private
 */

const deleteAreview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await Review.findByIdAndRemove(id).clone();
    res.status(204).json();
  }
);

export { getReviews, createReview, updateReview, deleteAreview };
