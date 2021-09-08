export interface ProductSku {
  id: number;
  sku: string;
  productId: number;
  stock: number;
  variantValueIds: number[];
}
