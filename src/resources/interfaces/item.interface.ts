interface Item {
  name: string;
  image: string;
  description: string;
  ratingsQunatity?: number;
  averageRating?: number;
  quantity: number;
  unitPrice: number;
  createdAt?: Date;
}

export default Item;
