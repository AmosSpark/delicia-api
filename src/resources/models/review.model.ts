import { Schema, model } from "mongoose";

import Item from "@/resources/models/item.model";
import Review from "@/resources/interfaces/review.interface";

const ReviewSchema: Schema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please rate the item"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment cannot be empty"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Reveiw must belong to an item"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Avoid duplicate review

ReviewSchema.index({ item: 1, user: 1 }, { unique: true });

// Populate - customer

ReviewSchema.pre(/^find/, function (next: Function) {
  this.populate({
    path: "item",
    select: "name unitPrice",
  }).populate({
    path: "user",
    select: "firstName lastName",
  });

  next();
});

export default model<Review>("Review", ReviewSchema);
