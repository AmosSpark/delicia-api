import byctypt from "bcrypt";

import jwt from "jsonwebtoken";
import { createSendToken } from "@/middleware/token.middleware";
import { Request, Response, NextFunction } from "express";
import User from "@/resources/models/user.model";
import Login from "@/resources/interfaces/login.interface";
import HttpException from "@/utils/exceptions/http.exception";
import * as dotenv from "dotenv";

dotenv.config();

/*
 * @route POST /api/v1/signup
 * @desc register new user
 * @ascess public
 */

const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    try {
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
    } catch (error: any) {
      res.status(400).json({
        status: `fail`,
        message: error.message,
      });
    }
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @route POST /api/v1/login
 * @desc login a user
 * @ascess public
 */

const logUserIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const login: Login = req.body;
    // check if email || password is passed
    if (!login.email || !login.password) {
      res.status(400).json({
        status: `fail`,
        message: `Please provide email and password`,
      });
    }

    // check if user exist
    const user = await User.findOne({
      email: login.email,
    }).select("+password");

    // comppare passwords
    if (!user || !(await byctypt.compare(login.password, user.password!))) {
      res.status(401).json({
        status: `fail`,
        message: `Incorrect email or password`,
      });
    } else {
      createSendToken(user, 200, res);
    }
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

/*
 * @desc protect private routes
 */

const protectRoute = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    // check tokem / get token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: `fail`,
        message: `Please login first`,
      });
    }

    // verify token
    const JWT_SECRET = String(process.env.JWT_SECRET);
    // const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    jwt.verify(token, JWT_SECRET, async function (err: any, decoded: any) {
      if (err) {
        return res.status(401).json({
          status: `fail`,
          message: `Unauthorized request, please login again`,
        });
      } else {
        const freshUser = await User.findById(decoded.id);

        if (!freshUser) {
          return res.status(401).json({
            status: `fail`,
            message: `The user belonging to this token no loger exist`,
          });
        } else {
          // GRANT USER ACCESS TO PROTECTED ROUTE
          req.user = freshUser;
        }
      }
    });

    next();
  } catch (error: any) {
    next(new HttpException(400, error.message));
  }
};

export { createNewUser, logUserIn, protectRoute };
