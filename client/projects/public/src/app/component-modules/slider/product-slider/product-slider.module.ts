import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../audi-ui/icon/icon.module';
import { ButtonModule } from '../../audi-ui/button/button.module';
import { SwiperModule } from 'swiper/angular';
import { ProductSliderComponent } from './product-slider.component';

const COMPONENTS = [ProductSliderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    IconModule,
    ButtonModule,
    SwiperModule,
  ],
  exports: [...COMPONENTS],
})
export class ProductSliderModule {}
