import { CartItem } from "./cart.type";

export interface OrderItem {
  id: number;
  customerId: number;
  totalAmount: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "canceled";
  createdAt: string;
  items: CartItem[];
}
