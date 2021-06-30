import { PagedRequest } from "./pagination";

export interface ProductCategoryParams extends PagedRequest {
  parentId?: number;
  name?: string | null;
  description?: string | null;
}
