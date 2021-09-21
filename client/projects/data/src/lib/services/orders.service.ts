import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { OrderParams } from '../models/order-params';
import { Address } from '../models/address';
import { CreditCard } from '../models/credit-card';
import { PaginatedResult } from '../models/pagination';
import { getPaginatedResult, getPaginationHeaders } from '../helpers';
import { INJECT_API_ENDPOINT } from '@audi/data';

export interface OrderItemUpsert {
  id?: number;
  productId: number;
  skuId: number;
  quantity: number;
}

export interface OrderUpsert {
  id?: number;
  email: string;
  billingAddress: Address;
  shippingAddress: Address;
  creditCard: CreditCard;
  orderItems: OrderItemUpsert[];
  customerNotes?: string;
  shippingMethod: string;
}

export interface OrderStatusUpdateRequest {
  id: number;
  status: string;
  trackingNumber?: string;
  shippingAddress?: Address;
  internalNotes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private endpoint = this.injectApiEndpoint + '/orders';

  constructor(
    @Inject(INJECT_API_ENDPOINT) private injectApiEndpoint: string,
    private http: HttpClient
  ) {}

  createOrder(request: OrderUpsert): Observable<Order> {
    return this.http.post<Order>(this.endpoint, request);
  }

  updateOrderStatus(request: OrderStatusUpdateRequest): Observable<Order> {
    return this.http.put<Order>(this.endpoint, request);
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.endpoint}/${orderId}`);
  }

  getOrders(orderParams: OrderParams): Observable<PaginatedResult<Order[]>> {
    const { pageNumber, pageSize, ...restOfOrderParams } = orderParams;
    let params = getPaginationHeaders(pageNumber, pageSize);

    Object.keys(restOfOrderParams).forEach((key) => {
      const property = (restOfOrderParams as unknown as any)[key];
      if (property != null) {
        params = params.append(key, property.toString());
      }
    });

    return getPaginatedResult<Order[]>(this.http, this.endpoint, params);
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.endpoint}/user/${userId}`);
  }
}
