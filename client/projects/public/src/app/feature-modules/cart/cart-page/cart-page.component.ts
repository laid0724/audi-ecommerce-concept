import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  CartItem,
  LanguageCode,
  LanguageStateService,
  Product,
} from '@audi/data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isProductDiscounted } from '../../../helpers';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'audi-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit, OnDestroy {
  cart: CartItem[] = [];

  isDesktop: boolean;

  destroy$ = new Subject<boolean>();

  public isDiscounted: (product: Product) => boolean = isProductDiscounted;

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  get totalPrice(): number {
    return this.cart.reduce(
      (sum, cartItem) =>
        sum + this.getPrice(cartItem.product) * cartItem.quantity,
      0
    );
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private languageService: LanguageStateService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });

    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart: CartItem[]) => {
        this.cart = cart;
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

  removeItem(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
