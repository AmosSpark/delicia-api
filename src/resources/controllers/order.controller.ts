import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import catchAsync from "@/utils/catch-async.utils";
import AppError from "@/utils/app-error.utils";
import Order from "@/resources/models/order.model";
import User from "@/resources/models/user.model";
import Item from "@/resources/models/item.model";
import * as dotenv from "dotenv";

dotenv.config();

/*
 * @route GET api/v1/orders
 * @desc get all order
 * @ascess private
 */

const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find();

    return res.status(200).json({
      status: `success`,
      result: orders.length,
      data: {
        orders,
      },
    });
  }
);

/*
 * @route POST /api/v1/items/:itemId/orders
 * @desc create a review
 * @ascess private
 */

const makeAnOrder = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction) => {
    // get user
    const JWT_SECRET = String(process.env.JWT_SECRET);
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) return err;
      const user = await User.findById(decoded.id);
      req.user = user;

      try {
        // create new order
        const newOrder = await Order.create({
          user: req.user.id,
          quantity: req.body.quantity,
          item: req.params.id,
        });

        if (!(await Item.findById(req.params.id))) {
          return next(
            new AppError(`Item with 'id': ${req.params.id} not found`, 404)
          );
        }

        res.status(201).json({
          status: `success`,
          data: {
            order: newOrder,
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
 * @route GET api/v1/orders/:id
 * @desc get an order
 * @ascess private
 */

const getAnOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const order = await Order.findById(id);

    if (!order) {
      return next(new AppError(`order with 'id': ${id} not found`, 404));
    }

    return res.status(200).json({
      status: `success`,
      data: {
        order,
      },
    });
  }
);

/*
 * @route DELETE api/v1/orders/:id
 * @desc delete/cancel an order
 * @ascess private
 */

const deleteAnOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await Order.findByIdAndRemove(id);
    res.status(204).json();
  }
);

export { getOrders, makeAnOrder, getAnOrder, deleteAnOrder };
