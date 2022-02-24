import { Types } from "mongoose";

interface Order {
  user: Types.ObjectId;
  item: Types.ObjectId;
  quantity: number;
  orderTimestamps?: Date;
  delivered?: boolean;
  deliveryTimestamps?: Date;
}

export default Order;
