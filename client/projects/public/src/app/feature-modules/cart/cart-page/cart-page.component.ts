import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  CartItem,
  LanguageCode,
  LanguageStateService,
  Product,
} from '@audi/data';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isProductDiscounted } from '../../../helpers';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'audi-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('headerBg') headerBg: ElementRef<HTMLDivElement>;

  cart: CartItem[] = [];

  isDesktop: boolean;
  _breakpointObserverSubscription: Subscription;

  destroy$ = new Subject<boolean>();

  windowScrollListenerFn: () => void;

  public isDiscounted: (product: Product) => boolean = isProductDiscounted;

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  get totalPrice(): number {
    return this.cart.reduce(
      (sum, cartItem) => sum + this.getPrice(cartItem.product) * cartItem.quantity,
      0
    );
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    private languageService: LanguageStateService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this._breakpointObserverSubscription = this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });

    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart: CartItem[]) => {
        this.cart = cart;
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
