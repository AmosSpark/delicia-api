import { Schema, model } from "mongoose";

import Order from "@/resources/interfaces/order.interface";

const OrderSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
    quantity: {
      type: Number,
      required: [true, "Order quantity cannot be null"],
    },
    orderTimestamps: {
      type: Date,
      default: Date.now,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    deliveryTimestamps: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OrderSchema.pre(/^find/, function (next: Function) {
  this.populate({
    path: "item",
    select: "name unitPrice",
  });
  next();
});

export default model<Order>("Order", OrderSchema);
