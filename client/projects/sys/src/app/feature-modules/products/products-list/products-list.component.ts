import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  BusyService,
  PaginatedResult,
  Pagination,
  Product,
  ProductParams,
  ProductsService,
} from '@audi/data';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  paging: Pagination;

  initialQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    productCategoryId: undefined,
    name: undefined,
    isVisible: undefined,
    price: undefined,
    stock: undefined,
  };

  productParams: ProductParams = this.initialQueryParams;

  datagridLoading = false;

  products: Product[] = [];

  refresher$ = new Subject<ProductParams>();
  destroy$ = new Subject<boolean>();

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.refresher$
      .pipe(
        startWith(this.productParams),
        switchMap((productParams: ProductParams) => {
          this.datagridLoading = true;
          return this.route.queryParamMap.pipe(
            switchMap((params: ParamMap) => {
              if (
                params.has('productCategoryId') &&
                params.get('productCategoryId') !== null
              ) {
                const productCategoryId = parseInt(
                  params.get('productCategoryId') as string
                );

                this.productParams = {
                  ...productParams,
                  productCategoryId,
                };
              }
              return this.productsService.getProducts(this.productParams);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res: PaginatedResult<Product[]>) => {
        this.products = res.result;
        this.paging = res.pagination;
        this.datagridLoading = false;
        this.busyService.idle();
      });
  }

  refreshDatagrid(state: ClrDatagridStateInterface): void {}

  promptDelete(productId: number): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
