import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AccountService,
  BusyService,
  LanguageCode,
  LanguageStateService,
  Order,
  OrderParams,
  OrdersService,
  PaginatedResult,
  Pagination,
  User,
} from '@audi/data';
import { Subject } from 'rxjs';
import { filter, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-members-order-list',
  templateUrl: './members-order-list.component.html',
  styleUrls: ['./members-order-list.component.scss'],
})
export class MembersOrderListComponent implements OnInit, OnDestroy {
  loading = true;

  orders: Order[];
  pagination: Pagination;

  queryParams: OrderParams = {
    userId: undefined,
    pageNumber: 1,
    pageSize: 10,
  };

  refresher$ = new Subject<OrderParams>();
  destroy$ = new Subject<boolean>();

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  constructor(
    private accountService: AccountService,
    private orderService: OrdersService,
    private busyService: BusyService,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {
    this.accountService.currentUser$
      .pipe(
        filter((user: User | null) => user !== null),
        switchMap((user: User | null) => {
          const { id } = user as User;

          this.queryParams.userId = id;

          return this.refresher$.pipe(
            startWith(this.queryParams),
            switchMap((qp: OrderParams) => {
              this.loading = true;
              return this.orderService.getOrders(this.queryParams);
            }),
            takeUntil(this.destroy$)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((paginatedOrders: PaginatedResult<Order[]>) => {
        const { result, pagination } = paginatedOrders;

        this.orders = result;
        this.pagination = pagination;

        this.loading = false;
        this.busyService.idle();
      });
  }

  onPageChange(pageNumber: number): void {
    this.queryParams.pageNumber = pageNumber;
    this.refresher$.next(this.queryParams);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
