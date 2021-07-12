import { PagedRequest } from "./pagination";

export interface DynamicDocumentParams extends PagedRequest {
  title?: string;
  type?: string;
  isVisible?: boolean;
  dateStart?: Date;
  dateEnd?: Date;
}
