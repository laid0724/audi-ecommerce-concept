import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  BusyService,
  isNullOrEmptyString,
  LanguageStateService,
  PaginatedResult,
  Product,
  ProductPhoto,
  ProductsService,
} from '@audi/data';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { NotificationService } from '../../../component-modules/audi-ui/services/notification-service/notification.service';

// TODO: transloco
// TODO: RWD
// TODO: implement product info panel
// TODO: variant selector
// TODO: product out of stock
// TODO: product like/unlike
// TODO: product add to cart
// TODO: product checkout btn

@Component({
  selector: 'audi-products-single',
  templateUrl: './products-single.component.html',
  styleUrls: ['./products-single.component.scss'],
})
export class ProductsSingleComponent implements OnInit, OnDestroy {
  product: Product;
  similarProducts: Product[];

  fullpageConfig: any;
  fullpageRef: any;

  language = this.languageService.getCurrentLanguage();
  isLoading = true;

  get imgUrls(): string[] {
    if (this.product) {
      return this.product.photos.map((p) => p.url);
    }
    return [];
  }

  get hasWysiwygContent(): boolean {
    const rows = this.product.wysiwyg.rows;
    return (
      this.product &&
      this.product.wysiwyg &&
      rows &&
      Array.isArray(rows) &&
      rows.length > 0 &&
      rows.some((row) =>
        row.columns.some((column) => !isNullOrEmptyString(column.content))
      )
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private notificationService: NotificationService,
    private languageService: LanguageStateService,
    private transloco: TranslocoService,
    private busyService: BusyService
  ) {
    // for more details on config options please visit fullPage.js docs
    // see: https://github.com/alvarotrigo/fullPage.js
    this.fullpageConfig = {
      // fullpage options
      licenseKey: 'YOUR_KEY_HERE',
      verticalCentered: false,
      fitToSection: true,
      scrollOverflow: true,
      resetSlider: true,
      paddingTop: '56px', // fixed header height
    };
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap((_) => (this.isLoading = true)),
        filter((params: ParamMap) => params.has('productId')),
        switchMap((params: ParamMap) =>
          this.productService.getProduct(+params.get('productId')!)
        ),
        tap((product: Product) => (this.product = product)),
        switchMap((product: Product) =>
          this.productService.getIsVisibleProducts({
            pageNumber: 1,
            pageSize: 10,
            includeChildrenProducts: true,
            productCategoryId: product.productCategoryId,
          })
        ),
        tap(
          (paginatedProducts: PaginatedResult<Product[]>) =>
            (this.similarProducts = paginatedProducts.result.filter(
              (p) => p.id !== this.product.id
            ))
        )
      )
      .subscribe(
        (_) => {
          this.isLoading = false;
          this.busyService.clear();
          this.busyService.idle();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.router.navigate(['/not-found']);
          }
        }
      );
  }

  getFullpageRef(fullpageRef: any) {
    this.fullpageRef = fullpageRef;

    if (this.hasWysiwygContent) {
      /*
        the height of the full page sections gets messed up after
        the wysiwyg content renders (if height is > than 1 section page)
        need to re-init the fullpage ref to refit sections to the correct section
        heights
      */
      this.fullpageRef.reBuild();
    }
  }

  getProductMainPhoto(photos: ProductPhoto[]): ProductPhoto | undefined {
    return photos.find((p) => p.isMain);
  }

  ngOnDestroy(): void {
    if (this.fullpageRef) {
      this.fullpageRef.destroy('all');
    }
  }
}
