import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AccountService, Order, OrdersService, User } from '@audi/data';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private orderService: OrdersService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const routeHasOrderId = route.paramMap.has('orderId');

    if (!routeHasOrderId) return of(false);

    const orderId = +route.paramMap.get('orderId')!;

    return this.accountService.currentUser$.pipe(
      take(1),
      switchMap((user: User | null) => {
        if (user === null) return of(false);

        const { id } = user;

        return this.orderService
          .getOrdersByUserId(id)
          .pipe(
            map((orders: Order[]) =>
              orders.map(({ id }) => id).includes(orderId)
            )
          );
      })
    );
  }
}
