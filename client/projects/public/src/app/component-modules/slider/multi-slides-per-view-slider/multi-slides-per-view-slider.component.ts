import {
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';
import { ProjectAsTemplateDirective } from '@audi/data';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { v4 as uuid } from 'uuid';

// Documentation:
// https://swiperjs.com/angular
// Api Documentation:
// https://swiperjs.com/swiper-api

// import Swiper core and required modules
import SwiperCore, { Navigation, Autoplay, Swiper } from 'swiper/core';

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

/*

  USAGE

  dont wrap this around an aui-layout > aui-grid > aui-cell if the parent element
  is already wrapped around an aui-grid system

  <audi-multi-slides-per-view-slider
    [slidesPerView]="3"
    [spaceBetween]="10"
    [autoplay]="false"
    [isLightTheme]="false"
  >
    <ng-container *ngFor="let i of [1, 2, 3, 4, 5]">
      <div
        *projectAsTemplate
        class="flex flex-col items-center justify-center"
        style="min-height: 300px; max-width: 300px"
      >
        <img
          src="https://www.forbes.com/advisor/wp-content/uploads/2021/04/dogecoin.jpeg-900x510.jpg"
        />
        <h4 class="aui-headline-4">Product</h4>
        <h6 class="aui-headline-6">$1,000</h6>
        <audi-button type="primary">Primary</audi-button>
      </div>
    </ng-container>
  </audi-multi-slides-per-view-slider>

*/

@Component({
  selector: 'audi-multi-slides-per-view-slider',
  templateUrl: './multi-slides-per-view-slider.component.html',
  styleUrls: ['./multi-slides-per-view-slider.component.scss'],
})
export class MultiSlidesPerViewSliderComponent implements OnInit, OnDestroy {
  // see: https://stackoverflow.com/questions/51506636/how-can-i-use-contentchildren-and-only-render-a-specific-child-component-instea
  @ContentChildren(ProjectAsTemplateDirective)
  slides: QueryList<ProjectAsTemplateDirective>;

  @Input() isLightTheme: boolean = false;

  @Input() autoplay: boolean = false;
  @Input() autoplayTransitionTime: number = 3000;
  @Input() slidesPerView: number = 3;
  @Input() spaceBetween: number = 10;

  /*
    HACK
    by adding unique class to swiper navigations, swiping one slider
    wont affect other sliders on the same page.
  */
  nextArrowUniqueClass: string = uuid();
  prevArrowUniqueClass: string = uuid();

  isDesktop: boolean;

  destroy$ = new Subject<boolean>();

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
