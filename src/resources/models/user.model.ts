import { Schema, model } from "mongoose";

import validator from "validator";
import bcrypt from "bcrypt";
import User from "@/resources/interfaces/user.interface";

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, `Firstname is required`],
      minlength: 2,
      maxlength: 50,
      validate: [
        validator.isAlpha,
        "Firstname should be contain characters a-zA-Z only",
      ],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, `Lastname is required`],
      minlength: 2,
      maxlength: 50,
      validate: [
        validator.isAlpha,
        "Firstname should be contain characters a-zA-Z only",
      ],
    },
    avatar: { type: String },
    email: {
      type: String,
      trim: true,
      required: [true, `Please provide your email`],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, `Please provide a password`],
      select: false,
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, `Please confirm your password`],
    },
    phone: {
      type: String,
      required: [true, `Phone number is required`],
    },
    location: {
      state: { type: String },
      town: { type: String },
      address: { type: String },
    },
    isAdmin: {
      type: String,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Password Management

// - Register - store hashed password only

UserSchema.pre("save", async function (next: Function) {
  // if password is not modified, do nothing
  if (!this.isModified("password")) return next();
  // hash if password is modified
  this.password = await bcrypt.hash(this.password, 12);
  // do not persist passwordConfirm to db
  this.passwordConfirm = undefined;
  next();
});

// Virtual Population

UserSchema.virtual("cart", {
  ref: "Order",
  foreignField: "user",
  localField: "_id",
});

export default model<User>("User", UserSchema);
