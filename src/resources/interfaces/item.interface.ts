import { Model } from "mongoose";

interface Item {
  name: string;
  category: string;
  image: string;
  description: string;
  ratingsQunatity?: number;
  averageRating?: number;
  quantity: number;
  unitPrice: number;
  createdAt?: Date;
}

interface ItemM extends Model<Item> {
  calcItemStats: (this: Model<any>, ...args: any[]) => any;
}

export { Item, ItemM };
