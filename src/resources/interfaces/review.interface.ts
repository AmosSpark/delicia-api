import { Types } from "mongoose";

interface Review {
  rating: number;
  comment: string;
  createdAt?: Date;
  item: Types.ObjectId;
  user: Types.ObjectId;
}

export default Review;
