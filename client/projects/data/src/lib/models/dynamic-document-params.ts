import { DynamicDocumentType } from '../enums';
import { PagedRequest } from './pagination';

export enum DynamicDocumentSort {
  Date = 'date',
  DateDesc = 'dateDesc',
}

export interface DynamicDocumentParams extends PagedRequest {
  title?: string;
  type?: DynamicDocumentType;
  isVisible?: boolean;
  dateStart?: Date;
  dateEnd?: Date;
  createdAtStart?: Date;
  createdAtEnd?: Date;
  lastUpdatedStart?: Date;
  lastUpdatedEnd?: Date;
  sort?: DynamicDocumentSort;
}
