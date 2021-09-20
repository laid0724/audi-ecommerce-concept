import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
  AccountService,
  CartItem,
  getAllErrors,
  GREATER_THAN_ZERO_REGEX,
  LanguageCode,
  LanguageStateService,
  Order,
  OrdersService,
  Product,
  SensitiveUserData,
  ShippingMethod,
  User,
  NotificationService
} from '@audi/data';
import { TranslocoService } from '@ngneat/transloco';
import { of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { addressFormGroupBuilder } from '../../../component-modules/address-fg/address-fg.component';
import { isProductDiscounted } from '../../../helpers';
import { CartService } from '../../cart/services/cart.service';
import { creditCardFormGroupBuilder } from '../../../component-modules/credit-card-fg/credit-card-fg.component';

@Component({
  selector: 'audi-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  cart: CartItem[] = [];
  user: SensitiveUserData | null = null;

  orderForm: FormGroup;
  cartModalOpen: boolean = false;

  currentStep: 'info' | 'shipping' | 'payment' = 'info';

  step1Complete: boolean = false;
  step2Complete: boolean = false;

  isDesktop: boolean;

  destroy$ = new Subject<boolean>();

  public isDiscounted: (product: Product) => boolean = isProductDiscounted;

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  get totalPrice(): number {
    return (
      this.cart.reduce(
        (sum, cartItem) =>
          sum + this.getPrice(cartItem.product) * cartItem.quantity,
        0
      ) + this.orderForm.get('shippingFee')?.value
    );
  }

  get orderItemsFormArray(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  get shippingAddressFg(): FormGroup {
    return this.orderForm.get('shippingAddress') as FormGroup;
  }

  get billingAddressFg(): FormGroup {
    return this.orderForm.get('billingAddress') as FormGroup;
  }

  get shippingAddress(): string {
    const { country, city, district, postalCode, addressLine } =
      this.shippingAddressFg.value;

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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrdersService,
    private accountService: AccountService,
    private languageService: LanguageStateService,
    private notificationService: NotificationService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });

    this.initOrderForm();

    const shippingMethodControl = this.orderForm.get(
      'shippingMethod'
    ) as FormControl;
    const shippingFeeControl = this.orderForm.get('shippingFee') as FormControl;
    const isSameAddressControl = this.orderForm.get(
      'isSameAddress'
    ) as FormControl;

    shippingMethodControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: ShippingMethod) => {
        shippingFeeControl.reset();

        if (value === ShippingMethod.Standard) {
          shippingFeeControl.patchValue(0);
        }
        if (value === ShippingMethod.Expedited) {
          shippingFeeControl.patchValue(200);
        }
      });

    isSameAddressControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSame: boolean) =>
        isSame
          ? this.billingAddressFg.patchValue(this.shippingAddressFg.value)
          : this.billingAddressFg.reset({
              country: this.language === 'zh' ? '台灣' : 'Taiwan',
              state: this.language === 'zh' ? '台灣' : 'Taiwan',
            })
      );

    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart: CartItem[]) => {
        this.cart = cart;

        this.orderItemsFormArray.reset();

        if (cart.length > 0) {
          cart.forEach((item: CartItem) => {
            this.orderItemsFormArray.push(
              this.fb.group({
                productId: [item.product.id, [Validators.required]],
                skuId: [item.productSku.id, [Validators.required]],
                quantity: [
                  item.quantity,
                  [
                    Validators.required,
                    Validators.pattern(GREATER_THAN_ZERO_REGEX),
                  ],
                ],
              })
            );
          });
        }
      });

    this.accountService.currentUser$
      .pipe(
        switchMap((user: User | null) =>
          user == null
            ? of(null)
            : this.accountService.getUserPersonalInfo().pipe(take(1))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((user: SensitiveUserData | null) => {
        this.user = user;
        if (user) {
          this.orderForm.get('email')?.patchValue(user.email);
          this.shippingAddressFg.patchValue({
            ...user.address,
            country: this.language === 'zh' ? '台灣' : 'Taiwan',
            state: this.language === 'zh' ? '台灣' : 'Taiwan',
          });
          this.billingAddressFg.patchValue({
            ...user.address,
            country: this.language === 'zh' ? '台灣' : 'Taiwan',
            state: this.language === 'zh' ? '台灣' : 'Taiwan',
          });
        }
      });
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      orderItems: this.fb.array([]),
      // STEP 1 - YOUR INFO
      email: [null, [Validators.required, Validators.email]],
      shippingAddress: addressFormGroupBuilder(this.fb, this.language),
      customerNotes: [null],
      // STEP 2 - SHIPPING
      shippingMethod: [null, [Validators.required]],
      shippingFee: [0, [Validators.required]],
      // STEP 3 - PAYMENT
      isSameAddress: [true, [Validators.required]],
      billingAddress: addressFormGroupBuilder(this.fb, this.language),
      creditCard: creditCardFormGroupBuilder(this.fb),
    });
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

  directToLogin(): void {
    this.router.navigate(['/', this.language, 'login'], {
      queryParams: { redirectTo: this.router.routerState.snapshot.url },
    });
  }

  onSubmitStep1(): void {
    this.step1Complete = false;

    if (this.orderItemsFormArray.value.length < 1) {
      this.notificationService.error(
        this.transloco.translate('cart.emptyCart'),
        this.transloco.translate('notifications.error'),
        3000
      );
      return;
    }

    const step1Controls: AbstractControl[] = [
      this.orderForm.get('email')!,
      this.orderForm.get('shippingAddress')!,
    ];

    const hasInvalidControls = step1Controls
      .map((control) => control.invalid)
      .includes(true);

    if (hasInvalidControls) {
      console.log(getAllErrors(this.orderForm));
      step1Controls.forEach((control) => control.markAllAsTouched());
      return;
    }

    this.step1Complete = true;
    this.currentStep = 'shipping';
  }

  onSubmitStep2(): void {
    this.step2Complete = false;

    const step2Controls: AbstractControl[] = [
      this.orderForm.get('shippingMethod')!,
      this.orderForm.get('shippingFee')!,
    ];

    const hasInvalidControls = step2Controls
      .map((control) => control.invalid)
      .includes(true);

    if (hasInvalidControls) {
      console.log(getAllErrors(this.orderForm));
      step2Controls.forEach((control) => control.markAllAsTouched());
      return;
    }

    this.billingAddressFg.patchValue(this.shippingAddressFg.value);

    this.step2Complete = true;
    this.currentStep = 'payment';
  }

  onSubmitOrder(): void {
    if (this.orderForm.invalid) {
      console.log(getAllErrors(this.orderForm));
      this.orderForm.markAllAsTouched();
      return;
    }

    this.orderService
      .createOrder(this.orderForm.value)
      .pipe(take(1))
      .subscribe((order: Order) => {
        this.cartService.resetCart();

        this.notificationService.success(
          this.transloco.translate('notifications.orderPlaced'),
          this.transloco.translate('notifications.success'),
          3000
        );

        // btoa to encrypt string to base64, and then use JSON.parse(atob(<queryParamsValue>)) to decrypt
        // see: https://developer.mozilla.org/en-US/docs/Web/API/btoa

        this.router.navigate(['/', this.language, 'checkout', 'success'], {
          queryParams: { order: btoa(order.id.toString()) },
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
