import { Request, Response, NextFunction } from "express";

import byctypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createSendToken } from "@/middleware/token.middleware";
import catchAsync from "@/utils/catch-async.utils";
import AppError from "@/utils/app-error.utils";
import User from "@/resources/models/user.model";
import Login from "@/resources/interfaces/login.interface";
import * as dotenv from "dotenv";

dotenv.config();

/*
 * @route POST /api/v1/signup
 * @desc register new user
 * @ascess public
 */

const createNewUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // create user
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone: req.body.phone,
      location: {
        state: req.body.location.state,
        town: req.body.location.town,
        address: req.body.location.address,
      },
    });

    createSendToken(newUser, 201, res);
  }
);

/*
 * @route POST /api/v1/login
 * @desc login a user
 * @ascess public
 */

const logUserIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const login: Login = req.body;
    // check if email || password is passed
    if (!login.email || !login.password) {
      return next(new AppError(`Please provide email and password`, 400));
    }

    // check if user exist
    const user = await User.findOne({
      email: login.email,
    }).select("+password");

    // comppare passwords
    if (!user || !(await byctypt.compare(login.password, user.password!))) {
      return next(new AppError(`Incorrect email or password`, 401));
    }
    createSendToken(user, 200, res);
  }
);

/*
 * @desc protect private routes
 */

const protectRoute = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction) => {
    // check tokem / get token
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError(`Please login first`, 401));
    }

    // verify token
    const JWT_SECRET = String(process.env.JWT_SECRET);
    // const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    jwt.verify(token, JWT_SECRET, async function (err: any, decoded: any) {
      if (err) {
        return next(
          new AppError(`Unauthorized request: Please login again`, 401)
        );
      }
      const freshUser = await User.findById(decoded.id);

      if (!freshUser) {
        return next(new AppError(`This user no longer exist`, 401));
      }
      // GRANT USER ACCESS TO PROTECTED ROUTE
      req.user = freshUser;
    });

    next();
  }
);

export { createNewUser, logUserIn, protectRoute };
