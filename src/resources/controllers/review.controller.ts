import { Response, Request, NextFunction } from "express";

import jwt from "jsonwebtoken";
import HttpException from "@/utils/exceptions/http.exception";
import User from "@/resources/models/user.model";
import Review from "@/resources/models/review.model";
import * as dotenv from "dotenv";

dotenv.config();

/*
 * @route GET api/v1/reveiews
 * @desc get all reveiw
 * @ascess private
 */

const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

const createReview = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
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
        next();
      } catch (error: any) {
        res.status(400).json({
          status: `fail`,
          message: error.message,
        });
      }
    });
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route PATCH api/v1/reviews/:id
 * @desc update a review
 * @ascess private
 */

const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id,
      body = req.body;
    const reviewUpdate = await Review.findByIdAndUpdate(id, body, {
      new: true,
      runValidator: true,
    }).clone();
    if (reviewUpdate) {
      res.status(200).json({
        status: `success`,
        data: {
          reviewUpdate,
        },
      });
    } else {
      res.status(404).json({
        status: `fail`,
        message: `Review with ID: ${req.params.id} not found`,
      });
    }
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route DELETE api/v1/reviews/:reviewId
 * @desc delete a reveiw of an item
 * @ascess private
 */

const deleteAreview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Review.findByIdAndRemove(id).clone();
    res.status(204).json();
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

export { getReviews, createReview, updateReview, deleteAreview };
