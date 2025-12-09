import { ProductWithImages } from "./product.type";

export interface FavoriteItem {
  userId: number;
  productId: number;
  createdAt: string;
  product: ProductWithImages;
}
