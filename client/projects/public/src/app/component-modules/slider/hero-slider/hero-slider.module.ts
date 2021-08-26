import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../audi-ui/button/button.module';
import { IconModule } from '../../audi-ui/icon/icon.module';
import { IndicatorModule } from '../../audi-ui/indicator/indicator.module';
import { SwiperModule } from 'swiper/angular';
import { HeroSliderComponent } from './hero-slider.component';
import { PipesModule } from '@audi/data';

const COMPONENTS = [HeroSliderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SwiperModule,
    ButtonModule,
    IconModule,
    IndicatorModule,
    PipesModule,
  ],
  exports: [...COMPONENTS],
})
export class HeroSliderModule {}
