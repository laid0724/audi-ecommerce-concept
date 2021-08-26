import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  CarouselItem,
  HomepageCarouselItem,
  isNullOrEmptyString,
} from '@audi/data';

// FIXME: desktop/mobile indicators active pin are not in sync

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
  selector: 'audi-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.scss'],
})
export class HeroSliderComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;

  @Input() activeSlide: number = 0;
  @Input() autoplay: boolean = false;
  @Input() autoplayTransitionTime: number = 3000;
  @Input() fadeEffect: boolean = false;
  @Input() allowDrag: boolean = false;

  @Input() carouselItems: HomepageCarouselItem[] | CarouselItem[] = [];

  swiperInstance: Swiper;

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;

  get validCarouselItems(): HomepageCarouselItem[] | CarouselItem[] {
    if (Array.isArray(this.carouselItems)) {
      return this.carouselItems.filter(
        (c: HomepageCarouselItem | CarouselItem) =>
          c.isVisible && !isNullOrEmptyString(c?.photo?.url)
      );
    }
    return [];
  }

  constructor(private cdr: ChangeDetectorRef) {}

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
