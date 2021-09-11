import { Product } from "./product";
import { ProductSku } from "./product-sku";

export interface CartItem {
  product: Product;
  productSku: ProductSku;
  quantity: number;
}
