import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  BusyService,
  PaginatedResult,
  Pagination,
  ProductCategory,
  ProductCategoryParams,
  ProductsService,
} from '@audi/data';
import { Subject } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-products-category-list',
  templateUrl: './products-category-list.component.html',
  styleUrls: ['./products-category-list.component.scss'],
})
export class ProductsCategoryListComponent implements OnInit, OnDestroy {
  productCategories: ProductCategory[];
  paging: Pagination;

  productCategoryParams: ProductCategoryParams = {
    pageNumber: 1,
    pageSize: 10,
  };

  refresher$ = new Subject<ProductCategoryParams>();
  destroy$ = new Subject<boolean>();

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.refresher$
      .pipe(
        startWith(this.productCategoryParams),
        switchMap((productCategoryParams: ProductCategoryParams) =>
          this.route.queryParamMap.pipe(
            switchMap((params: ParamMap) => {
              if (params.has('parentId') && params.get('parentId')) {
                const parentId = +params.has('parentId');
                return this.productsService.getChildrenProductCategories({
                  ...productCategoryParams,
                  parentId,
                });
              }
              return this.productsService.getParentProductCategories(
                productCategoryParams
              );
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((res: PaginatedResult<ProductCategory[]>) => {
        this.productCategories = res.result;
        this.paging = res.pagination;
        this.busyService.idle();
      });
  }

  refreshDatagrid(event: any): void {}

  onEdit(id: number): void {}

  onDelete(id: number): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
