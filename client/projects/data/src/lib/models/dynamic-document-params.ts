import { PagedRequest } from './pagination';

export interface DynamicDocumentParams extends PagedRequest {
  title?: string;
  isVisible?: boolean;
  dateStart?: Date;
  dateEnd?: Date;
  createdAtStart?: Date;
  createdAtEnd?: Date;
  lastUpdatedStart?: Date;
  lastUpdatedEnd?: Date;
}
