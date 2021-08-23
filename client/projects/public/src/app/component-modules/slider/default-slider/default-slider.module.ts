import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { DefaultSliderComponent } from './default-slider.component';
import { AudiUiModule } from '../../audi-ui/audi-ui.module';

const COMPONENTS = [DefaultSliderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, SwiperModule, AudiUiModule],
  exports: [...COMPONENTS],
})
export class DefaultSliderModule {}
