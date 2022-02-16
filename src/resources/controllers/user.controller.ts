import { Request, Response, NextFunction } from "express";

import HttpException from "@/utils/exceptions/http.exception";
import User from "@/resources/models/user.model";

/*
 * @route GET api/v1/users
 * @desc get all user
 * @ascess private
 */

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: `success`,
      result: users.length,
      data: {
        users,
      },
    });
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route GET api/v1/users/:id
 * @desc get a user
 * @ascess private
 */

const getAuser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user: any = await User.findById(id).populate({
      path: "cart",
      options: {
        select: { item: 1, quantity: 1, orderTimestamps: 1 },
      },
    });

    if (!user) {
      res.status(404).json({
        status: `fail`,
        message: `User with ID: ${req.params.id} not found`,
      });
    }

    return res.status(200).json({
      status: `success`,
      data: {
        user,
      },
    });
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route GET api/v1/me
 * @desc get profile of current user
 * @ascess private
 */

const getMe = async (req: Request, res: Response, next: NextFunction) => {};

/*
 * @route PATCH api/v1/users/:id
 * @desc update user information
 * @ascess private
 */

const updateAuser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id,
      body = req.body;
    const userUpdate = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidator: true,
    });
    if (userUpdate) {
      res.status(200).json({
        status: `success`,
        data: {
          user: userUpdate,
        },
      });
    } else {
      res.status(404).json({
        status: `fail`,
        message: `User with ID: ${req.params.id} not found`,
      });
    }
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route POST api/v1/users/id
 * @desc delete user
 * @ascess private
 */

const deleteAuser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await User.findByIdAndRemove(id);
    res.status(204).json();
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

export { getAllUser, getAuser, updateAuser, deleteAuser };
