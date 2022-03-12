import { Schema, model } from "mongoose";

import { Item, ItemM } from "@/resources/interfaces/item.interface";

const ItemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 250,
    },
    averageRating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Avoid duplicate item

ItemSchema.index({ name: 1, description: 1 }, { unique: true });

// Virtual Population
/*
 * @desc poputate reviews when
 * 'api/v1/items/Id' is queried
 */

ItemSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "item",
  localField: "_id",
});

// Item statistics

/*
 * @desc calculate count, num. of ratings,
 * avg. rating, avg. price, min. price and
 * max. price of all items when
 * 'api/v1/items/stats' is queried
 */

ItemSchema.statics.calcItemStats = async function () {
  return await this.aggregate([
    {
      $match: {
        averageRating: { $gte: 1 },
      },
    },
    {
      $group: {
        _id: { $toUpper: "$category" },
        count: { $sum: 1 }, // number of items under each group/category
        numRating: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$averageRating" },
        avgPrice: { $avg: "$unitPrice" },
        minPrice: { $min: "$unitPrice" },
        maxPrice: { $max: "$unitPrice" },
      },
    },
    {
      // add new field 'category' and set it to the value of '_id'
      $addFields: {
        category: "$_id",
      },
    },
    {
      // remove filed '_id'
      $project: {
        _id: 0,
      },
    },
    {
      // change fileds order
      $replaceRoot: {
        newRoot: {
          category: "$category",
          count: "$count",
          numRating: "$numRating",
          avgRating: "$avgRating",
          avgPrice: "$avgPrice",
          minPrice: "$minPrice",
          maxPrice: "$maxPrice",
        },
      },
    },
    {
      $sort: {
        avgRating: -1, // sort by descending avgRating
      },
    },
  ]);
};

export default model<Item, ItemM>("Item", ItemSchema);
