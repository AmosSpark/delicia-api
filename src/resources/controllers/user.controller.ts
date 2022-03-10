import { Request, Response, NextFunction } from "express";

import catchAsync from "@/utils/catch-async.utils";
import AppError from "@/utils/app-error.utils";
import User from "@/resources/models/user.model";

/*
 * @route GET api/v1/users
 * @desc get all user
 * @ascess private
 */

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    return res.status(200).json({
      status: `success`,
      result: users.length,
      data: {
        users,
      },
    });
  }
);

/*
 * @route GET api/v1/users/:id
 * @desc get a user
 * @ascess private
 */

const getAuser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user: any = await User.findById(id).populate({
      path: "cart",
      options: {
        select: { item: 1, quantity: 1, orderTimestamps: 1 },
      },
    });

    if (!user) {
      return next(new AppError(`User with 'id': ${id} not found`, 404));
    }

    return res.status(200).json({
      status: `success`,
      data: {
        user,
      },
    });
  }
);

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

const updateAuser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id,
      body = req.body;
    const userToUpdate = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidator: true,
    });

    if (!userToUpdate) {
      return next(new AppError(`User with 'id': ${id} not found`, 404));
    }

    res.status(200).json({
      status: `success`,
      data: {
        user: userToUpdate,
      },
    });
  }
);

/*
 * @route POST api/v1/users/id
 * @desc delete user
 * @ascess private
 */

const deleteAuser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await User.findByIdAndRemove(id);
    res.status(204).json();
  }
);

export { getAllUser, getAuser, updateAuser, deleteAuser };
