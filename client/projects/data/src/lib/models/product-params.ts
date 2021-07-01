import { PagedRequest } from "./pagination";

export interface ProductParams extends PagedRequest {
  productCategoryId?: number;
  name?: string;
  isVisible?: boolean;
  isDiscounted?: boolean;
  price?: number;
  stock?: number;
}
