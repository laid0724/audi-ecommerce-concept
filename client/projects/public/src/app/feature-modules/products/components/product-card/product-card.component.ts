import { ElementRef } from '@angular/core';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  LanguageCode,
  LanguageStateService,
  Product,
  ProductPhoto,
} from '@audi/data';
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

  preloadedImageUrls: string[] = [];

  mouseOverTriggered: boolean = false;

  // see: https://stackoverflow.com/questions/51040703/what-return-type-should-be-used-for-settimeout-in-typescript
  imageTransitionTimeouts: ReturnType<typeof setTimeout>[] = [];

  cardMouseOverFn: () => void;
  cardMouseOutFn: () => void;

  constructor(
    private languageService: LanguageStateService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {}

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

                if (i === this.preloadedImageUrls.length - 1) {
                  setTimeout(() => {
                    this.renderer.setStyle(
                      coverImageWrapper,
                      'background-image',
                      'url(' + this.mainProductPhoto?.url + ')'
                    );
                  }, 1000);
                }
              }, i * 1000)
            );
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

  ngOnDestroy(): void {
    this.cardMouseOverFn();
    this.cardMouseOutFn();
  }
}
