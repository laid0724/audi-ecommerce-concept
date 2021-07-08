import { ProductCategory } from "./product-category";
import { ProductPhoto } from './product-photo';
import { WysiwygGrid } from './wysiwyg';

export interface Product {
  id: number;
  productCategoryId: number;
  productCategory?: ProductCategory;
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
}
