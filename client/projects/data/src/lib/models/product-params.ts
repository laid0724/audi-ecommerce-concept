import { PagedRequest } from './pagination';

export enum ProductSort {
  CreatedAt = 'createdAt',
  CreatedAtDesc = 'createdAtDesc',
  Price = 'price',
  PriceDesc = 'priceDesc',
}

export interface ProductParams extends PagedRequest {
  productCategoryId?: number;
  name?: string;
  isVisible?: boolean;
  isDiscounted?: boolean;
  priceMin?: number;
  priceMax?: number;
  stockMin?: number;
  stockMax?: number;
  sort?: ProductSort;
  includeChildrenProducts?: boolean;
}
