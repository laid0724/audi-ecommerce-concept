import { Product } from "./product";

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  parentId?: number;
  children: ProductCategory[];
  products: Product[]
}
