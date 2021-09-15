import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  BusyService,
  LanguageCode,
  LanguageStateService,
  Order,
  OrdersService,
  Product,
} from '@audi/data';
import { of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { isProductDiscounted } from '../../../helpers';

@Component({
  selector: 'audi-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss'],
})
export class CheckoutSuccessComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('headerBg') headerBg: ElementRef<HTMLDivElement>;

  order: Order;

  loading = true;

  destroy$ = new Subject<boolean>();

  windowScrollListenerFn: () => void;

  public isDiscounted: (product: Product) => boolean = isProductDiscounted;

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  get totalPrice(): number {
    return (
      this.order.orderItems.reduce(
        (sum, cartItem) =>
          sum + this.getPrice(cartItem.product) * cartItem.quantity,
        0
      ) + this.order.shippingFee
    );
  }

  get shippingAddress(): string {
    const { country, city, district, postalCode, addressLine } =
      this.order.shippingAddress;

    const enShippingAddress = [addressLine, district, city, postalCode, country]
      .toString()
      .split(',')
      .join(', ');

    const zhShippingAddress = [postalCode, ' ', city, district, addressLine]
      .toString()
      .split(',')
      .join('');

    return this.language === LanguageCode.Zh
      ? zhShippingAddress
      : enShippingAddress;
  }

  get billingAddress(): string {
    const { country, city, district, postalCode, addressLine } =
      this.order.billingAddress;

    const enBillingAddress = [addressLine, district, city, postalCode, country]
      .toString()
      .split(',')
      .join(', ');

    const zhBillingAddress = [postalCode, ' ', city, district, addressLine]
      .toString()
      .split(',')
      .join('');

    return this.language === LanguageCode.Zh
      ? zhBillingAddress
      : enBillingAddress;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private busyService: BusyService,
    private orderService: OrdersService,
    private languageService: LanguageStateService
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
      .subscribe(
        (order: Order | null) => {
          if (order === null) {
            this.router.navigateByUrl('/not-found');
          }

          this.order = order as Order;
          this.loading = false;
          this.busyService.idle();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.router.navigateByUrl('/not-found');
          }
        }
      );
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

  getPrice(product: Product): number {
    return this.isDiscounted(product)
      ? product.price - product.discountAmount
      : product.price;
  }

  getProductMainPhotoUrl(product: Product): string {
    if (
      product.photos &&
      Array.isArray(product.photos) &&
      product.photos.length > 0
    ) {
      const mainPhoto = product.photos.find((p) => p.isMain);
      if (mainPhoto) {
        return mainPhoto.url;
      }
    }

    return 'assets/images/placeholder-original.png';
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.windowScrollListenerFn) {
      this.windowScrollListenerFn();
    }

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
