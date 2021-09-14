import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BusyService, Order, OrdersService } from '@audi/data';
import { of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
})
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  order: Order;

  loading = true;

  destroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busyService: BusyService,
    private orderService: OrdersService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        filter((params: Params) => params.has('order')),
        switchMap((params: Params) => {
          const orderId = +atob(params.get('order'));

          if (isNaN(orderId)) {
            return of(null);
          }

          return this.orderService.getOrder(orderId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((order: Order | null) => {
        if (order === null) {
          this.router.navigateByUrl('/not-found');
        }

        this.order = order as Order;
        this.loading = false;
        this.busyService.idle();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
