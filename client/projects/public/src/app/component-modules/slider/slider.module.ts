import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultSliderModule } from './default-slider/default-slider.module';
import { MultiSlidesPerViewSliderModule } from './multi-slides-per-view-slider/multi-slides-per-view-slider.module';
import { ProductSliderModule } from './product-slider/product-slider.module';
import { HeroSliderModule } from './hero-slider/hero-slider.module';

const SLIDER_MODULES = [
  DefaultSliderModule,
  MultiSlidesPerViewSliderModule,
  ProductSliderModule,
  HeroSliderModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...SLIDER_MODULES],
  exports: [...SLIDER_MODULES],
})
export class SliderModule {}
