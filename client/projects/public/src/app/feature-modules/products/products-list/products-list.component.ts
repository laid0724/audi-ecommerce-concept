import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  BusyService,
  isEqualOrGreaterThanValidator,
  NUMBER_REGEX,
  PaginatedResult,
  Pagination,
  Product,
  ProductCategoryWithoutProducts,
  ProductParams,
  ProductSort,
  ProductsService,
  setQueryParams,
} from '@audi/data';
import { Subject } from 'rxjs';
import { startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'audi-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  productCategories: ProductCategoryWithoutProducts[] = [];
  products: Product[] = [];

  filterForm: FormGroup;
  filterModalIsOpen: boolean = false;

  productSortEnum: typeof ProductSort = ProductSort;

  productParams: ProductParams = {
    pageSize: 12,
    pageNumber: 1,
    includeChildrenProducts: true,
  };
  pagination: Pagination;
  isParamsEmpty: boolean = true;

  loading = true;

  isDesktop: boolean;

  refresher$ = new Subject<ProductParams>();
  destroy$ = new Subject<boolean>();

  getProductCategoryName(
    productCategoryId: number | undefined
  ): string | undefined {
    if (productCategoryId == undefined) {
      return undefined;
    }
    return this.productCategories.find(({ id }) => id === +productCategoryId)
      ?.name;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private productsService: ProductsService,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.initFilterForm();

    this.filterForm
      .get('priceMin')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.filterForm
          ?.get('priceMax')
          ?.updateValueAndValidity({ onlySelf: true });
      });

    this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });

    this.productsService
      .getAllProductCategories()
      .pipe(
        take(1),
        tap((categories: ProductCategoryWithoutProducts[]) => {
          this.productCategories = categories.flatMap(
            (pc: ProductCategoryWithoutProducts) => [pc, ...pc.children]
          );
        }),
        switchMap((_) =>
          this.route.queryParamMap.pipe(
            tap((qp: ParamMap) => {
              const productParamKeys = [
                'pageNumber',
                'productCategoryId',
                'name',
                'priceMin',
                'priceMax',
                'sort',
                'includeChildrenProducts',
                'isDiscounted',
              ];

              this.isParamsEmpty = true;

              productParamKeys.forEach((param: string) => {
                if (qp.has(param)) {
                  this.productParams = {
                    ...this.productParams,
                    [param]: qp.get(param),
                  };

                  if (
                    this.isParamsEmpty &&
                    param !== 'sort' &&
                    param !== 'pageNumber' &&
                    param !== 'includeChildrenProducts'
                  ) {
                    this.isParamsEmpty = false;
                  }
                }
              });

              this.filterForm.patchValue(this.productParams);
            }),
            switchMap((_) =>
              this.refresher$.pipe(
                startWith(this.productParams),
                switchMap((productParams: ProductParams) => {
                  return this.productsService.getIsVisibleProducts(
                    productParams
                  );
                }),
                takeUntil(this.destroy$)
              )
            )
          )
        )
      )
      .subscribe((productsPaged: PaginatedResult<Product[]>) => {
        this.products = productsPaged.result;
        this.pagination = productsPaged.pagination;

        this.loading = false;
        this.busyService.idle();
      });
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      name: [undefined],
      productCategoryId: [undefined],
      isDiscounted: [undefined],
      priceMin: [undefined, [Validators.pattern(NUMBER_REGEX)]],
      priceMax: [
        undefined,
        [
          Validators.pattern(NUMBER_REGEX),
          isEqualOrGreaterThanValidator('priceMin'),
        ],
      ],
    });
  }

  onSubmitFilter(): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    // reset previous params
    this.productParams = {
      ...this.productParams,
      pageNumber: 1,
      name: undefined,
      productCategoryId: undefined,
      isDiscounted: undefined,
      priceMin: undefined,
      priceMax: undefined,
    };

    const filterValues: Partial<ProductParams> = Object.keys(
      this.filterForm.value
    )
      .filter((key) => !!this.filterForm.value[key])
      .map((key) => ({ [key]: this.filterForm.value[key] }))
      .reduce(
        (obj: Partial<ProductParams>, param: { [key: string]: any }) => ({
          ...obj,
          ...param,
        }),
        {}
      );

    if (filterValues.productCategoryId) {
      filterValues.productCategoryId = parseInt(
        filterValues.productCategoryId.toString()
      );
    }

    this.productParams = {
      ...this.productParams,
      ...filterValues,
    };

    this.filterModalIsOpen = false;

    // HACK
    /*
      Angular's router navigate event will trigger onDestroy on all the components that
      are on this component's template if you navigate to the same page via router.navigate([]).
      So, when I set the query parameter while the modal is open,
      the modal's onDestroy event will remove the modal from modal service,
      causing the component to lose id reference to the DOM element.

      The modal then breaks and then you cannot close it.

      this seems to be the only article that i can find on the issue,
      which has to do with messing with the routing strategies.
      see: https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular/41515648#41515648

      Too complex, dont have time for now.

      right now, use set timeout to hard push the router navigate event to the back of the
      event loop, allowing the modal to close first.

      FIXME: REVISIT LATER
    */
    setTimeout(() => {
      this.setQueryParams(this.productParams);
    }, 0);
  }

  onResetFilters(): void {
    this.productParams = {
      pageSize: 12,
      pageNumber: 1,
      includeChildrenProducts: true,
    };

    this.filterForm.reset();

    if (!this.isDesktop) {
      this.filterModalIsOpen = false;
    }

    setTimeout(() => {
      this.setQueryParams();
    }, 0);
  }

  onPageChange(page: number): void {
    this.productParams = {
      ...this.productParams,
      pageNumber: page,
    };

    this.setQueryParams(this.productParams);
  }

  onSortProduct(sort: ProductSort): void {
    this.productParams = {
      ...this.productParams,
      sort,
      pageNumber: 1,
    };

    this.setQueryParams(this.productParams);
  }

  setQueryParams(queryParams = {}, queryParamsHandling = ''): void {
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
