import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountService,
  LanguageCode,
  LanguageStateService,
  Product,
  ProductPhoto,
  ProductsService,
  User,
} from '@audi/data';
import { take } from 'rxjs/operators';
import { CardComponent } from 'projects/public/src/app/component-modules/audi-ui/card/card/card.component';

@Component({
  selector: 'audi-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('card') cardComponent: CardComponent;
  @ViewChild('card', { read: ElementRef }) cardElRef: ElementRef;

  @Input() product: Product;

  user: User | null = null;

  preloadedImageUrls: string[] = [];

  mouseOverTriggered: boolean = false;

  // see: https://stackoverflow.com/questions/51040703/what-return-type-should-be-used-for-settimeout-in-typescript
  imageTransitionTimeouts: ReturnType<typeof setTimeout>[] = [];

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  get mainProductPhoto(): ProductPhoto | undefined {
    if (this.product == null || this.product.photos == null) {
      return undefined;
    }

    return this.product.photos.find((photo: ProductPhoto) => photo.isMain);
  }

  get productPhotos(): ProductPhoto[] {
    return this.product.photos.sort((a, b) => +b.isMain - +a.isMain);
  }

  cardMouseOverFn: () => void;
  cardMouseOutFn: () => void;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private accountService: AccountService,
    private productService: ProductsService,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe((user: User | null) => {
      this.user = user;
    });
  }

  ngAfterViewInit(): void {
    const coverImageWrapper = this.cardElRef.nativeElement.querySelector(
      '.aui-card__cover-image'
    );

    const coverImage = this.cardElRef.nativeElement.querySelector(
      '.aui-card__cover-image img'
    );

    const isDisabled = this.cardComponent.isDisabled;

    this.cardMouseOverFn = this.renderer.listen(
      this.cardElRef.nativeElement,
      'mouseover',
      (e: Event) => {
        if (
          !isDisabled &&
          this.preloadedImageUrls.length >= 1 &&
          !this.mouseOverTriggered
        ) {
          this.mouseOverTriggered = true;

          this.renderer.addClass(coverImage, 'opacity-0');

          this.preloadedImageUrls.forEach((url: string, i: number) => {
            this.imageTransitionTimeouts.push(
              setTimeout(() => {
                this.renderer.setStyle(
                  coverImageWrapper,
                  'background-image',
                  'url(' + url + ')'
                );
              }, i * 1500)
            );
            if (i === this.preloadedImageUrls.length - 1) {
              this.imageTransitionTimeouts.push(
                setTimeout(() => {
                  this.renderer.setStyle(
                    coverImageWrapper,
                    'background-image',
                    'url(' + this.mainProductPhoto?.url + ')'
                  );
                }, this.preloadedImageUrls.length * 1500)
              );
            }
          });
        }
      }
    );

    this.cardMouseOutFn = this.renderer.listen(
      this.cardElRef.nativeElement,
      'mouseout',
      (e: Event) => {
        if (
          !isDisabled &&
          this.preloadedImageUrls.length >= 1 &&
          this.mouseOverTriggered
        ) {
          this.mouseOverTriggered = false;

          this.renderer.removeClass(coverImage, 'opacity-0');

          this.renderer.setStyle(
            coverImageWrapper,
            'background-image',
            'url(' + this.mainProductPhoto?.url + ')'
          );

          this.clearImageTransitionTimeouts();
        }
      }
    );
  }

  clearImageTransitionTimeouts(): void {
    this.imageTransitionTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
  }

  productIsLikedByUser(productId: number): boolean {
    if (this.user) {
      return this.user.likedProductIds.some((id) => id === productId);
    }

    return false;
  }

  onLikeClicked(e: Event, productId: number): void {
    e.preventDefault();
    e.stopPropagation();

    if (this.user != null) {
      this.productIsLikedByUser(productId)
        ? this.unlikeProduct(productId)
        : this.likeProduct(productId);
    }

    if (this.user == null) {
      this.directToLogin();
    }
  }

  likeProduct(productId: number): void {
    this.productService
      .likeProduct(productId)
      .pipe(take(1))
      .subscribe((likedProducts: Product[]) => {
        this.accountService.setCurrentUser({
          ...(this.user as User),
          likedProductIds: likedProducts.map((p: Product) => p.id) as number[],
        });
      });
  }

  unlikeProduct(productId: number): void {
    this.productService
      .unlikeProduct(productId)
      .pipe(take(1))
      .subscribe((likedProducts: Product[]) => {
        this.accountService.setCurrentUser({
          ...(this.user as User),
          likedProductIds: likedProducts.map((p: Product) => p.id) as number[],
        });
      });
  }

  directToLogin(): void {
    this.router.navigate(['/', this.language, 'login'], {
      queryParams: { redirectTo: this.router.routerState.snapshot.url },
    });
  }

  ngOnDestroy(): void {
    this.cardMouseOverFn();
    this.cardMouseOutFn();
  }
}
