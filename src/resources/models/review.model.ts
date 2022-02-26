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

// calculate avg. rating of an Item - when a new review is submitted

ReviewSchema.statics.calcAverageRatings = async function (itemId) {
  const stats = await this.aggregate([
    {
      $match: { item: itemId },
    },
    {
      $group: {
        _id: "item",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    // update Item
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: stats[0].nRating,
      averageRating: stats[0].avgRating,
    });
  } else {
    // set to default
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: 0,
      averageRating: 4.5,
    });
  }
};

ReviewSchema.post("save", function () {
  // points to current reveiw
  this.constructor.calcAverageRatings(this.item); // this.constructor = Model (Review)
});

// calculate avg. rating of an Item - when a review is updated

ReviewSchema.pre(/^findOneAnd/, async function (next) {
  // points to query of reveiw
  this.rev = await this.findOne();
  next();
});

ReviewSchema.post(/^findOneAnd/, async function () {
  // when query executes
  await this.constructor.calcAverageRatings(this.rev.item);
});

export default model<Review>("Review", ReviewSchema);
