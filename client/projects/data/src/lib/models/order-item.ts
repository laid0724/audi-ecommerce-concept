import { Product } from "./product";

export interface OrderItem {
  id: number;
  product: Product;
  variantValueId: number;
  quantity: number;
  price: number;
}
