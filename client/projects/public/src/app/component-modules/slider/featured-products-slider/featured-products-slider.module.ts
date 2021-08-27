import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../audi-ui/button/button.module';
import { IconModule } from '../../audi-ui/icon/icon.module';
import { IndicatorModule } from '../../audi-ui/indicator/indicator.module';
import { SwiperModule } from 'swiper/angular';
import { PipesModule } from '@audi/data';
import { TranslocoModule } from '@ngneat/transloco';

import { FeaturedProductsSliderComponent } from './featured-products-slider.component';


const COMPONENTS = [FeaturedProductsSliderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SwiperModule,
    ButtonModule,
    IconModule,
    IndicatorModule,
    PipesModule,
    TranslocoModule
  ],
  exports: [...COMPONENTS],
})
export class FeaturedProductsSliderModule {}
