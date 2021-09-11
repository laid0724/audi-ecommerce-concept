import { OrderStatus } from '../enums';
import { Address } from './address';
import { OrderItem } from './order-item';

export interface Order {
  id: number;
  orderNumber: string;
  userId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  billingAddress: Address;
  shippingAddress: Address;
  totalPrice: number;
  creditCardLast4Digit: string;
  creditCardType: string;
  createdAt: Date;
  lastUpdated: Date;
  orderItems: OrderItem[];
  trackingNumber: string;
  previousStatuses: OrderStatusHistory[];
  currentStatus: OrderStatus;
  customerNotes: string;
  internalNotes: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  updatedAt: Date;
}
