import { ProductPhoto } from './product-photo';
import { ProductSku } from './product-sku';
import { ProductVariant } from "./product-variant";
import { WysiwygGrid } from './wysiwyg';

export interface Product {
  id: number;
  productCategoryId: number;
  name: string;
  description: string;
  createdAt: Date;
  lastUpdated: Date;
  wysiwyg: WysiwygGrid;
  isVisible: boolean;
  isDiscounted: boolean;
  discountAmount: number;
  discountDeadline?: Date;
  price: number;
  stock: number;
  photos: ProductPhoto[];
  variants: ProductVariant[];
  skus: ProductSku[];
}
