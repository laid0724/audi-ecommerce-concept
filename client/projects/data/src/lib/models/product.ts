import { ProductPhoto } from './product-photo';
import { ProductVariant } from "./product-variant";
import { WysiwygGrid } from './wysiwyg';

export interface Product {
  id: number;
  productCategoryId: number;
  name: string;
  descripion: string;
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
}
