import { HostListener, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Data,
  ParamMap,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import {
  BusyService,
  LanguageCode,
  LanguageStateService,
  PaginatedResult,
  Pagination,
  Product,
  ProductCategory,
  ProductParams,
  ProductsService,
  setQueryParams,
  stringToBoolean,
} from '@audi/data';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import {
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  ClrCustomBtnFilter,
  ClrMinMaxRangeFilter,
  ClrServerSideNumberFilter,
  ClrServerSideStringFilter,
} from '../../../component-modules/clr-datagrid-utilities/datagrid-filters';

@Component({
  selector: 'audi-sys-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  @HostListener('document:keydown.escape', ['$event']) onEscapeHandler(
    event: KeyboardEvent
  ) {
    if (this.confirmDeleteModalOpen) {
      this.cancelDelete();
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnterHandler(
    event: KeyboardEvent
  ) {
    if (this.confirmDeleteModalOpen && this.productToDelete !== null) {
      this.onDelete(this.productToDelete.id);
    }
  }

  paging: Pagination;

  initialQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    productCategoryId: undefined,
    name: undefined,
    isVisible: undefined,
    isDiscounted: undefined,
    priceMin: undefined,
    priceMax: undefined,
    stockMin: undefined,
    stockMax: undefined,
  };

  productParams: ProductParams = this.initialQueryParams;

  productNameFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'name'
  );
  productCategoryIdFilter: ClrServerSideNumberFilter =
    new ClrServerSideNumberFilter('productCategoryId');
  isVisibleFilter: ClrCustomBtnFilter = new ClrCustomBtnFilter('isVisible');
  isDiscountedFilter: ClrCustomBtnFilter = new ClrCustomBtnFilter(
    'isDiscounted'
  );
  priceFilter: ClrMinMaxRangeFilter = new ClrMinMaxRangeFilter('price');
  stockFilter: ClrMinMaxRangeFilter = new ClrMinMaxRangeFilter('stock');

  datagridLoading = true;
  confirmDeleteModalOpen = false;

  products: Product[] = [];
  productCategories: ProductCategory[] = [];

  productToDelete: Product | null = null;

  currentLanguage: LanguageCode;

  refresher$ = new Subject<ProductParams>();
  destroy$ = new Subject<boolean>();

  constructor(
    private productsService: ProductsService,
    private busyService: BusyService,
    private languageService: LanguageStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this will restart component when hitting the same route,
    // this way refresher will fire again when we reset query params
    // e.g., when we switch language
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data
      .pipe(
        tap((data: Data) => {
          this.datagridLoading = true;
          this.productCategories = data.productCategories;
        }),
        switchMap((_) =>
          this.refresher$.pipe(
            startWith(this.productParams),
            switchMap((productParams: ProductParams) =>
              /*
                HACK:
                  since we are getting our initial product categories from the resolver,
                  which calls the api based on our selected language header, the product categories mapper
                  will malfunction because none of the en product category id can be mapped.
                  we therefore need to refetch the product categories for the mapper, but we cannot re-call the resolver again.
                  therefore, we are detecting our language changes in the following manner and then re-calling the parent categories
                  again with our language interceptor header to refresh the data.

                  we are also refreshing our query param state because clarity cannot
                  detect the param changes when the filters are wiped when we change the language between zh <--> en

                FIXME: clear all datagrid filter values on the UI on language change
              */
              this.languageService.language$.pipe(
                map((lang: LanguageCode) => {
                  if (this.currentLanguage == null) {
                    this.currentLanguage = lang;
                  }

                  if (this.currentLanguage != lang) {
                    this.currentLanguage = lang;
                    this.productParams = this.initialQueryParams;
                    this.productsService.allParentCategories$
                      .pipe(
                        map((productCategories: ProductCategory[]) =>
                          productCategories.flatMap((pc) => [
                            pc,
                            ...pc.children,
                          ])
                        ),
                        take(1)
                      )
                      .subscribe((pc) => (this.productCategories = pc));
                    return this.productParams;
                  }
                  return productParams;
                })
              )
            ),
            switchMap((productParams: ProductParams) => {
              return this.route.queryParamMap.pipe(
                switchMap((params: ParamMap) => {
                  console.log(productParams);
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
        )
      )
      .subscribe((res: PaginatedResult<Product[]>) => {
        this.products = res.result;
        this.paging = res.pagination;
        this.datagridLoading = false;
        this.busyService.idle();
      });
  }

  public productCategoryMapperFn(
    productCategories: ProductCategory[]
  ): (productCategoryId: number) => ProductCategory | undefined {
    return (productCategoryId: number) =>
      productCategories.find(
        (productCategory: ProductCategory) =>
          productCategory.id === productCategoryId
      );
  }

  productCategoryIdMapper(searchKeyword: string): number | undefined {
    return this.productCategories.find((pc) => pc.name.includes(searchKeyword))
      ?.id;
  }

  refreshDatagrid(state: ClrDatagridStateInterface): void {
    if (
      this.datagridLoading ||
      state == null ||
      Object.keys(state).length === 0
    ) {
      return;
    }

    this.productParams = {
      ...this.productParams,
      pageNumber: state.page?.current as number,
      pageSize: state.page?.size as number,
      productCategoryId: undefined,
      name: undefined,
      isVisible: undefined,
      isDiscounted: undefined,
      priceMin: undefined,
      priceMax: undefined,
      stockMin: undefined,
      stockMax: undefined,
    };

    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = <{ property: string; value: string }>filter;
        if (
          ['name', 'productCategoryId', 'isVisible', 'isDiscounted'].includes(
            property
          )
        ) {
          this.productParams = {
            ...this.productParams,
            [property]: value,
          };
        }
        if (['isVisible', 'isDiscounted'].includes(property)) {
          this.productParams = {
            ...this.productParams,
            [property]: stringToBoolean(value),
          };
        }
        if (['price', 'stock'].includes(property)) {
          this.productParams = {
            ...this.productParams,
            [`${property}Min`]: value[0],
            [`${property}Max`]: value[1],
          };
        }
      }
    }

    console.log(this.productParams);

    this.refresher$.next(this.productParams);
  }

  promptDelete(product: Product): void {
    this.productToDelete = product;
    this.confirmDeleteModalOpen = true;
  }

  cancelDelete(): void {
    this.productToDelete = null;
    this.confirmDeleteModalOpen = false;
  }

  onDelete(productId: number): void {
    this.productsService
      .deleteProduct(productId)
      .pipe(take(1))
      .subscribe(() => {
        this.productToDelete = null;
        this.confirmDeleteModalOpen = false;
        this.refresher$.next(this.productParams);
      });
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
