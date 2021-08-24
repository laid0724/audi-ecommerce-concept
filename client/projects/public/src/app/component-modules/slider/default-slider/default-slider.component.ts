import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewChild,
} from '@angular/core';
import { ProjectAsTemplateDirective } from '@audi/data';

// Documentation:
// https://swiperjs.com/angular
// Api Documentation:
// https://swiperjs.com/swiper-api
import { SwiperComponent } from 'swiper/angular';

// import Swiper core and required modules
import SwiperCore, { Navigation, Autoplay, Swiper } from 'swiper/core';

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

/*

  USAGE:

  <audi-default-slider
    [autoplay]="false"
    [isLightTheme]="false"
    [indicatorInSlide]="false"
    [indicatorIsShadowed]="false"
    [indicatorOnly]="false"
    [allowDrag]="true"
  >
    <ng-container *ngFor="let slide of [1, 2, 3, 4, 5]">
      <img
        class="mx-auto object-cover w-screen"
        *projectAsTemplate
        src="https://www.forbes.com/advisor/wp-content/uploads/2021/04/dogecoin.jpeg-900x510.jpg"
      />
    </ng-container>
  </audi-default-slider>

*/

@Component({
  selector: 'audi-default-slider',
  templateUrl: './default-slider.component.html',
  styleUrls: ['./default-slider.component.scss'],
})
export class DefaultSliderComponent implements AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;

  // see: https://stackoverflow.com/questions/51506636/how-can-i-use-contentchildren-and-only-render-a-specific-child-component-instea
  @ContentChildren(ProjectAsTemplateDirective)
  slides: QueryList<ProjectAsTemplateDirective>;

  @Input() activeSlide: number = 0;
  @Input() autoplay: boolean = false;
  @Input() autoplayTransitionTime: number = 3000;

  @Input() isLightTheme: boolean = false;
  @Input() indicatorInSlide: boolean = false;
  @Input() indicatorIsShadowed: boolean = false;
  @Input() indicatorOnly: boolean = false;
  @Input() allowDrag: boolean = false;

  swiperInstance: Swiper;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.swiperInstance = this.swiper.swiperRef as Swiper;
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
