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
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import {
  BusyService,
  PaginatedResult,
  Pagination,
  Product,
  ProductCategoryWithoutProducts,
  ProductParams,
  ProductSort,
  ProductsService,
  setQueryParams,
} from '@audi/data';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'audi-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('headerBg') headerBg: ElementRef<HTMLDivElement>;

  _productCategories$: Observable<ProductCategoryWithoutProducts[]> =
    this.productsService.getAllProductCategories();

  productCategories: ProductCategoryWithoutProducts[] = [];
  products: Product[] = [];

  filterForm: FormGroup;
  filterModalIsOpen: boolean = false;

  productParams: ProductParams = {
    pageSize: 1,
    pageNumber: 1,
  };
  pagination: Pagination;
  isParamsEmpty: boolean = true;

  productSort = ProductSort;

  refresher$ = new Subject<ProductParams>();
  destroy$ = new Subject<boolean>();

  windowScrollListenerFn: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        tap((qp: ParamMap) => {
          const productParamKeys = [
            'pageNumber',
            'productCategoryId',
            'name',
            'priceMin',
            'priceMax',
            'sort',
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
                param !== 'pageNumber'
              ) {
                this.isParamsEmpty = false;
              }
            }
          });
        }),
        switchMap((_) =>
          this.refresher$.pipe(
            startWith(this.productParams),
            switchMap((productParams: ProductParams) => {
              return this.productsService.getIsVisibleProducts(productParams);
            }),
            takeUntil(this.destroy$)
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
    this.filterForm = this.fb.group({});
  }

  onSubmitFilter(): void {
    // TODO: form & modal
  }

  onResetFilters(): void {
    this.productParams = {
      pageSize: 12,
      pageNumber: 1,
    };

    this.setQueryParams();
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

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
