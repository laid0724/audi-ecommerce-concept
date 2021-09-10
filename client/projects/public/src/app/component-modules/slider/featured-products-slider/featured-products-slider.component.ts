import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  Product,
  isNullOrEmptyString,
  ProductPhoto,
  LanguageStateService,
  LanguageCode,
} from '@audi/data';

// FIXME: desktop/mobile indicators active pin are not in sync
// FIXME: aui buttons in nav do not have click response when swiper navigation element is assigned via css class instead of template ref

// Documentation:
// https://swiperjs.com/angular
// Api Documentation:
// https://swiperjs.com/swiper-api
import { SwiperComponent } from 'swiper/angular';

// import Swiper core and required modules
import SwiperCore, {
  Navigation,
  Autoplay,
  Swiper,
  EffectFade,
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([Navigation, Autoplay, EffectFade]);

@Component({
  selector: 'audi-featured-products-slider',
  templateUrl: './featured-products-slider.component.html',
  styleUrls: ['./featured-products-slider.component.scss'],
})
export class FeaturedProductsSliderComponent
  implements AfterViewInit, AfterViewChecked
{
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;

  @Input() activeSlide: number = 0;
  @Input() autoplay: boolean = false;
  @Input() autoplayTransitionTime: number = 3000;
  @Input() fadeEffect: boolean = false;
  @Input() allowDrag: boolean = false;

  @Input() featuredProducts: Product[] = [];

  swiperInstance: Swiper;

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  get validProducts(): Product[] {
    if (Array.isArray(this.featuredProducts)) {
      return this.featuredProducts.filter((p: Product) => {
        const mainPhoto = p.photos.find((photo) => photo.isMain);

        return (
          p.isVisible &&
          mainPhoto != null &&
          !isNullOrEmptyString(mainPhoto.url)
        );
      });
    }
    return [];
  }

  getMainPhoto(product: Product): ProductPhoto | undefined {
    return product.photos.find((photo) => photo.isMain);
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private languageService: LanguageStateService
  ) {}

  ngAfterViewInit(): void {
    this.swiperInstance = this.swiper.swiperRef as Swiper;
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  onActiveSlideChange(swiper: any): void {
    const { activeIndex } = swiper as Swiper;
    if (this.swiperInstance != null) {
      this.activeSlide = activeIndex;

      // swiper and audi ui runs outside of ngZone, so manual change detect trigger is needed
      this.cdr.detectChanges();
    }
  }

  slideTo(i: number): void {
    this.swiperInstance.slideTo(i);
    this.activeSlide = i;
  }
}
