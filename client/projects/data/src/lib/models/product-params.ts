import { PagedRequest } from "./pagination";

export interface ProductParams extends PagedRequest {
  productCategoryId?: number;
}
