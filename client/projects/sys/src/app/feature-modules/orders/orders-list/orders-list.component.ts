import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import { objectIsEqual, toZhMapper } from '@audi/data';
import {
  BusyService,
  Order,
  OrderParams,
  OrdersService,
  OrderStatus,
  PaginatedResult,
  Pagination,
  setQueryParams,
} from '@audi/data';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import {
  ClrCustomBtnFilter,
  ClrMinMaxRangeFilter,
  ClrServerSideStringFilter,
} from '../../../component-modules/clr-datagrid-utilities/datagrid-filters';

@Component({
  selector: 'audi-sys-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  paging: Pagination;

  initialQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    // userId: undefined,
    priceMin: undefined,
    priceMax: undefined,
    orderNumber: undefined,
    currentStatus: undefined,
    lastName: undefined,
    firstName: undefined,
    email: undefined,
    phoneNumber: undefined,
  };

  orderParams: OrderParams = this.initialQueryParams;

  orderNumberFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'orderNumber'
  );
  firstNameFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'firstName'
  );
  lastNameFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'lastName'
  );
  emailFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'email'
  );
  phoneNumberFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'phoneNumber'
  );
  priceFilter: ClrMinMaxRangeFilter = new ClrMinMaxRangeFilter('price');
  currentStatusFilter: ClrCustomBtnFilter = new ClrCustomBtnFilter(
    'currentStatus'
  );

  currentStatusOptions = [
    ...Object.keys(OrderStatus)
      .map((key) => (OrderStatus as unknown as any)[key])
      .map((status: OrderStatus) => ({
        value: status,
        label: toZhMapper(status, 'orderStatusWithEn'),
      })),
    { value: null, label: null },
  ];

  datagridLoading = true;

  orders: Order[];

  refresher$ = new Subject<OrderParams>();
  destroy$ = new Subject<boolean>();

  constructor(
    private ordersService: OrdersService,
    private busyService: BusyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this will restart component when hitting the same route,
    // this way refresher will fire again when we reset query params
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.refresher$
      .pipe(
        startWith(this.orderParams),
        switchMap((orderParams: OrderParams) =>
          this.ordersService.getOrders(this.orderParams)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((res: PaginatedResult<Order[]>) => {
        this.orders = res.result;
        this.paging = res.pagination;
        this.datagridLoading = false;
        this.busyService.idle();
      });
  }

  refreshDatagrid(state: ClrDatagridStateInterface): void {
    if (
      this.datagridLoading ||
      state == null ||
      Object.keys(state).length === 0
    ) {
      return;
    }

    const oldState = this.orderParams;

    this.orderParams = {
      ...this.orderParams,
      pageNumber: state.page?.current as number,
      pageSize: state.page?.size as number,
      // userId: undefined,
      priceMin: undefined,
      priceMax: undefined,
      orderNumber: undefined,
      currentStatus: undefined,
      lastName: undefined,
      firstName: undefined,
      email: undefined,
      phoneNumber: undefined,
    };

    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = <{ property: string; value: string }>filter;
        if (
          [
            // 'userId',
            'orderNumber',
            'currentStatus',
            'lastName',
            'firstName',
            'email',
            'phoneNumber',
          ].includes(property)
        ) {
          this.orderParams = {
            ...this.orderParams,
            [property]: value,
          };
        }
        if (['price'].includes(property)) {
          this.orderParams = {
            ...this.orderParams,
            [`${property}Min`]: value[0],
            [`${property}Max`]: value[1],
          };
        }
      }
    }

    if (!objectIsEqual(oldState, this.orderParams)) {
      this.refresher$.next(this.orderParams);
    }
  }

  resetQueryParams(queryParams = {}, queryParamsHandling = ''): void {
    this.paging.currentPage = 1;
    setQueryParams(
      this.router,
      this.route,
      queryParams,
      queryParamsHandling as QueryParamsHandling
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
