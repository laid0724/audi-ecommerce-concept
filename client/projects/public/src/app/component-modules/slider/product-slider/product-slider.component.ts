import {
  ChangeDetectorRef,
  IterableDiffer,
  ViewChild,
  AfterViewInit,
  Component,
  DoCheck,
  Input,
  IterableDiffers,
  NgZone,
} from '@angular/core';

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

/*
  USAGE: wrap component around a wrapper to control its max-width

  <div class="slider-wrapper" style="max-width: 400px">
    <audi-product-slider
      [imgUrls]="[
        'https://www.forbes.com/advisor/wp-content/uploads/2021/04/dogecoin.jpeg-900x510.jpg',
        'https://mk0timesnextw7n7qiu0.kinstacdn.com/wp-content/uploads/2021/05/dogecoin-the-biggest-hype-of-2021-explained.jpeg',
        'https://www.forbes.com/advisor/wp-content/uploads/2021/04/dogecoin.jpeg-900x510.jpg',
        'https://mk0timesnextw7n7qiu0.kinstacdn.com/wp-content/uploads/2021/05/dogecoin-the-biggest-hype-of-2021-explained.jpeg',
        'https://www.forbes.com/advisor/wp-content/uploads/2021/04/dogecoin.jpeg-900x510.jpg'
      ]"
    ></audi-product-slider>
  </div>
*/

@Component({
  selector: 'audi-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss'],
})
export class ProductSliderComponent implements DoCheck, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;

  @Input() autoplay: boolean = false;
  @Input() autoplayTransitionTime: number = 3000;
  @Input() allowDrag: boolean = true;
  @Input() imgUrls: string[] = [];

  activeSlide: number = 0;

  iterableDiffer: IterableDiffer<string>;

  swiperInstance: Swiper;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private iterableDiffers: IterableDiffers
  ) {
    this.iterableDiffer = iterableDiffers.find([]).create(undefined);
  }

  ngDoCheck(): void {
    /*
      angular change detection for inputs are performed on a dirty basis, i.e.,
      if array or object, check if it is being pointed to the same instance.
      it doesn't check for changes in its elements/properties.
      so OnChanges will never be triggered when elements of the input array are changed.

      to solve this, we need check for changes in the array by ourselves via the IterableDiffers API
      see: https://stackoverflow.com/questions/42962394/angular-2-how-to-detect-changes-in-an-array-input-property
    */

    const imgUrlInputHasChanged = this.iterableDiffer.diff(this.imgUrls);

    if (imgUrlInputHasChanged) {
      this.ngZone.runOutsideAngular(() => {
        // sent it to the back of the event loop so fslightbox js can property detect DOM elements created via angular
        setTimeout(() => {
          this.recreateFsLightboxInstance();
        }, 0);
      });
    }
  }

  ngAfterViewInit(): void {
    this.swiperInstance = this.swiper.swiperRef as Swiper;

    this.recreateFsLightboxInstance();

    this.cdr.detectChanges();
  }

  recreateFsLightboxInstance(): void {
    this.ngZone.runOutsideAngular(() => {
      // see: https://fslightbox.com/
      // Also see: typings/fslightbox.d.ts
      const lightbox = new FsLightbox();

      refreshFsLightbox();

      // you must use fsLightboxInstance to assign event callbacks, global instance wont work.
      // see: https://fslightbox.com/javascript/documentation/how-to-use#instances

      // Object.keys(fsLightboxInstances).forEach((key) => {
      //   const lightboxInstance = fsLightboxInstances[key];
      //   if (lightboxInstance) {
      //     lightboxInstance.props.onInit = () => console.log('onInit');
      //     lightboxInstance.props.onOpen = () => console.log('onOpen');
      //     lightboxInstance.props.onClose = () => console.log('onClose');
      //     lightboxInstance.props.onShow = () => console.log('onShow');
      //   }
      // });
    });
  }

  onActiveSlideChange(swiper: any): void {
    const { activeIndex } = swiper as Swiper;
    if (this.swiperInstance != null) {
      this.activeSlide = activeIndex;

      // swiper and audi ui runs outside of ngZone, so manual change detect trigger is needed
      this.cdr.detectChanges();
    }
  }
}
