import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultSliderModule } from './default-slider/default-slider.module';

const SLIDER_MODULES = [DefaultSliderModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...SLIDER_MODULES],
  exports: [...SLIDER_MODULES],
})
export class SliderModule {}
