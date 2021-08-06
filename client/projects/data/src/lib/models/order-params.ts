import { OrderStatus } from '../enums';
import { PagedRequest } from './pagination';

export interface OrderParams extends PagedRequest {
  userId?: number;
  priceMin?: number;
  priceMax?: number;
  orderNumber?: string;
  currentStatus?: OrderStatus;
  lastName?: string;
  firstName?: string;
  email?: string;
  phoneNumber?: string;
}
