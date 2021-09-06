import { Product } from "./product";
import { ProductSku } from "./product-sku";

export interface OrderItem {
  id: number;
  product: Product;
  productSku: ProductSku;
  quantity: number;
  price: number;
}
