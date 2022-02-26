import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import Order from "@/resources/models/order.model";
import User from "@/resources/models/user.model";
import HttpException from "@/utils/exceptions/http.exception";
import * as dotenv from "dotenv";
import itemModel from "../models/item.model";

dotenv.config();

/*
 * @route GET api/v1/orders
 * @desc get all order
 * @ascess private
 */

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({
      status: `success`,
      result: orders.length,
      data: {
        orders,
      },
    });
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route POST /api/v1/items/:itemId/orders
 * @desc create a review
 * @ascess private
 */

const makeAnOrder = async (
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
        // create new order
        const newOrder = await Order.create({
          user: req.user.id,
          quantity: req.body.quantity,
          item: req.params.id,
        });

        res.status(201).json({
          status: `success`,
          data: {
            order: newOrder,
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
 * @route GET api/v1/orders/:id
 * @desc get an order
 * @ascess private
 */

const getAnOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);
    return res.status(200).json({
      status: `success`,
      data: {
        order,
      },
    });
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route DELETE api/v1/orders/:id
 * @desc delete/cancel an order
 * @ascess private
 */

const deleteAnOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await Order.findByIdAndRemove(id);
    res.status(204).json();
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

export { getOrders, makeAnOrder, getAnOrder, deleteAnOrder };
