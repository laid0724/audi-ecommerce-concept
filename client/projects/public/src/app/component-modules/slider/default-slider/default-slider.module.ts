import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { DirectivesModule } from '@audi/data';
import { IconModule } from '../../audi-ui/icon/icon.module';
import { IndicatorModule } from '../../audi-ui/indicator/indicator.module';
import { DefaultSliderComponent } from './default-slider.component';

const COMPONENTS = [DefaultSliderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SwiperModule,
    IconModule,
    IndicatorModule,
    DirectivesModule,
  ],
  exports: [...COMPONENTS, DirectivesModule],
})
export class DefaultSliderModule {}
