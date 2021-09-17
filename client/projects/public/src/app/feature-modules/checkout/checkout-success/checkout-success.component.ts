import { HttpErrorResponse } from '@angular/common/http';
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
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  order: Order;

  loading = true;

  destroy$ = new Subject<boolean>();

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
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
