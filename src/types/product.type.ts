export interface Product {
  name: string;
  id: number;
  createdAt: Date;
  sellerId: number;
  categoryId: number | null;
  description: string | null;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
  publishedAt: Date | null;
  config?: ProductConfig;
  favoritedBy?: { id: number }[];
}

export interface ProductConfig {
  isStockInfinite: boolean;
  showStockWarning?: boolean;
}
export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isCover: boolean;
  displayOrder: number;
}

export type NewProductImage = Omit<ProductImage, "id" | "productId">;
export interface NewProduct
  extends Omit<
    Product,
    | "id"
    | "images"
    | "categoryId"
    | "description"
    | "createdAt"
    | "publishedAt"
    | "sellerId"
  > {
  images: NewProductImage[];
  description: string;
}

export type ProductStatus = "active" | "inactive";

export interface ProductWithImages extends Product {
  images: ProductImage[];
}
