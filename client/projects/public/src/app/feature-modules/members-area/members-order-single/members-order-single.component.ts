import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  BusyService,
  LanguageCode,
  LanguageStateService,
  Order,
  OrdersService,
  OrderStatus,
  Product,
} from '@audi/data';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, of } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../component-modules/audi-ui/services/notification-service/notification.service';
import { isProductDiscounted } from '../../../helpers';

@Component({
  selector: 'audi-members-order-single',
  templateUrl: './members-order-single.component.html',
  styleUrls: ['./members-order-single.component.scss'],
})
export class MembersOrderSingleComponent implements OnInit, OnDestroy {
  order: Order;

  loading = true;
  isDesktop = true;
  confirmCancelOrderModalOpen = false;

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
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private busyService: BusyService,
    private orderService: OrdersService,
    private languageService: LanguageStateService,
    private transloco: TranslocoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });

    this.route.paramMap
      .pipe(
        filter((params: Params) => params.has('orderId')),
        switchMap((params: Params) => {
          const orderId = +params.get('orderId');

          return this.orderService.getOrder(orderId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (order: Order) => {
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

  onCancelOrder(): void {
    this.orderService
      .updateOrderStatus({
        id: this.order.id,
        status: OrderStatus.Canceled,
      })
      .pipe(take(1))
      .subscribe((order: Order) => {
        this.order = order;

        this.notificationService.success(
          this.transloco.translate('notifications.orderCancelSuccess'),
          this.transloco.translate('notifications.success'),
          3000
        );

        this.confirmCancelOrderModalOpen = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
