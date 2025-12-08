import { ProductWithImages } from "./product.type";

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  addedAt: string;
  product: ProductWithImages;
}
