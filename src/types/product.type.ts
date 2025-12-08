export interface Product {
  name: string;
  id: number;
  createdAt: Date;
  sellerId: number;
  categoryId: number | null;
  description: string | null;
  price: number;
  stockQuantity: number;
  isStockInfinite: boolean;
  status: ProductStatus;
  publishedAt: Date | null;
}

export type ProductStatus = "active" | "inactive";

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isCover: boolean;
  displayOrder: number;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}
