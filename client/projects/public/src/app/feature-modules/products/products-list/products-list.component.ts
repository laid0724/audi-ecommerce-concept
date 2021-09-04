import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
import { Subject, Subscription } from 'rxjs';
import { startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

// TODO: transloco
// TODO: validators for filter min max price
// TODO: error message for filter min max price
@Component({
  selector: 'audi-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('headerBg') headerBg: ElementRef<HTMLDivElement>;

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

  isDesktop: boolean;
  _breakpointObserverSubscription: Subscription;

  refresher$ = new Subject<ProductParams>();
  destroy$ = new Subject<boolean>();

  windowScrollListenerFn: () => void;

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
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private productsService: ProductsService,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.initFilterForm();

    this._breakpointObserverSubscription = this.breakpointObserver
      .observe(['(min-width: 640px)'])
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

        this.busyService.idle();
      });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      /*
        using background-attachment: fixed ALONG with background-size: cover
        makes the background bg size all messed up.

        this is a workaround to that issue, mimicking parallax effect.

        see: https://stackoverflow.com/questions/21786272/css-background-size-cover-background-attachment-fixed-clipping-background-im
      */

      this.windowScrollListenerFn = this.renderer.listen(
        window,
        'scroll',
        (event: any) => {
          // see: see: https://stackoverflow.com/questions/28050548/window-pageyoffset-is-always-0-with-overflow-x-hidden
          const scrollTop = event.srcElement.scrollingElement.scrollTop;

          this.renderer.setStyle(
            this.headerBg.nativeElement,
            'transform',
            `translateY(${scrollTop}px)`
          );
        }
      );
    }
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      name: [undefined],
      productCategoryId: [undefined],
      isDiscounted: [undefined],
      priceMin: [undefined, [Validators.pattern(NUMBER_REGEX)]],
      priceMax: [undefined, [Validators.pattern(NUMBER_REGEX)]],
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
    this.setQueryParams();

    if (!this.isDesktop) {
      this.filterModalIsOpen = false;
    }
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
    if (isPlatformBrowser(this.platformId) && this.windowScrollListenerFn) {
      this.windowScrollListenerFn();
    }

    if (this._breakpointObserverSubscription) {
      this._breakpointObserverSubscription.unsubscribe();
    }

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
