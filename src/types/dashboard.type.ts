import { ProductWithImages } from "./product.type";

export interface DashboardData {
  chart: DashboardChartData[];
  bestSeller: ProductWithImages | null;
}

export interface DashboardChartData {
  date: string;
  fullDate: string;
  revenue: number;
  salesCount: number;
  favorites: number;
  inCarts: number;
}
