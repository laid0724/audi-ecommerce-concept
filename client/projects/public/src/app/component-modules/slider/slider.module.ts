import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultSliderModule } from './default-slider/default-slider.module';
import { MultiSlidesPerViewSliderModule } from './multi-slides-per-view-slider/multi-slides-per-view-slider.module';

const SLIDER_MODULES = [DefaultSliderModule, MultiSlidesPerViewSliderModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...SLIDER_MODULES],
  exports: [...SLIDER_MODULES],
})
export class SliderModule {}
